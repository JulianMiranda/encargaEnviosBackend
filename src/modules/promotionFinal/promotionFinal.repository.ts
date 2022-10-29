import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromotionFinal } from '../../dto/promotionFinal.dto';
import { Image } from '../../dto/image.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { ImageRepository } from '../image/image.repository';

@Injectable()
export class PromotionFinalRepository {
  readonly type = ENTITY.PROMOTIONFINAL;

  constructor(
    @InjectModel('PromotionFinal')
    private promotionFinalDb: Model<PromotionFinal>,
    private imageRepository: ImageRepository,
  ) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, promotionFinals] = await Promise.all([
        this.promotionFinalDb.countDocuments(filter),
        this.promotionFinalDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: promotionFinals };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter promotionFinals Database error',
        e,
      );
    }
  }

  async getOne(id: string): Promise<PromotionFinal> {
    try {
      const document = await this.promotionFinalDb
        .findOne({ _id: id })
        .populate([
          {
            path: 'image',
            match: { status: true },
            select: { url: true },
          },
          {
            path: 'subcategory',
            select: { name: true },
          },
        ]);

      if (!document)
        throw new NotFoundException(
          `Could not find promotionFinal for id: ${id}`,
        );

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException(
          'findPromotionFinal Database error',
          e,
        );
    }
  }

  async create(data: PromotionFinal, image: Partial<Image>): Promise<boolean> {
    try {
      const newPromotionFinal = new this.promotionFinalDb(data);
      const document = await newPromotionFinal.save();

      image.parentType = this.type;
      image.parentId = document._id;

      const imageModel = await this.imageRepository.insertImages([image]);

      return !!(await this.promotionFinalDb.findOneAndUpdate(
        { _id: document._id },
        { image: imageModel[0]._id },
      ));
    } catch (e) {
      throw new InternalServerErrorException(
        'createPromotionFinal Database error',
        e,
      );
    }
  }

  async update(
    id: string,
    data: Partial<PromotionFinal>,
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

      const document = await this.promotionFinalDb.findOneAndUpdate(
        { _id: id },
        { ...data, ...newImage },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find promotionFinal to update for id: ${id}`,
        );

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'updatePromotionFinal Database error',
        e,
      );
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.promotionFinalDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find promotionFinal to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'deletePromotionFinal Database error',
        e,
      );
    }
  }
}
