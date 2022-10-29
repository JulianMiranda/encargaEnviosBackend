import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion } from '../../dto/promotion.dto';
import { Image } from '../../dto/image.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { ImageRepository } from '../image/image.repository';

@Injectable()
export class PromotionRepository {
  readonly type = ENTITY.PROMOTION;

  constructor(
    @InjectModel('Promotion') private promotionDb: Model<Promotion>,
    private imageRepository: ImageRepository,
  ) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, promotions] = await Promise.all([
        this.promotionDb.countDocuments(filter),
        this.promotionDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: promotions };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter promotions Database error',
        e,
      );
    }
  }

  async getOne(id: string): Promise<Promotion> {
    try {
      const document = await this.promotionDb.findOne({ _id: id }).populate([
        {
          path: 'image',
          match: { status: true },
          select: { url: true },
        },
      ]);

      if (!document)
        throw new NotFoundException(`Could not find promotion for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException(
          'findPromotion Database error',
          e,
        );
    }
  }

  async create(data: Promotion, image: Partial<Image>): Promise<boolean> {
    try {
      const newPromotion = new this.promotionDb(data);
      const document = await newPromotion.save();

      image.parentType = this.type;
      image.parentId = document._id;

      const imageModel = await this.imageRepository.insertImages([image]);

      return !!(await this.promotionDb.findOneAndUpdate(
        { _id: document._id },
        { image: imageModel[0]._id },
      ));
    } catch (e) {
      throw new InternalServerErrorException(
        'createPromotion Database error',
        e,
      );
    }
  }

  async update(
    id: string,
    data: Partial<Promotion>,
    image: Partial<Image>,
  ): Promise<boolean> {
    try {
      let newImage = {};
      if (image) {
        await this.imageRepository.deleteImagesByTypeAndId(this.type, id);

        image.parentType = this.type;
        image.parentId = id;
        const imageModel = await this.imageRepository.insertImages([image]);
        newImage = { image: imageModel[0]._id };
      }

      const document = await this.promotionDb.findOneAndUpdate(
        { _id: id },
        { ...data, ...newImage },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find promotion to update for id: ${id}`,
        );

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'updatePromotion Database error',
        e,
      );
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.promotionDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find promotion to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'deletePromotion Database error',
        e,
      );
    }
  }
}
