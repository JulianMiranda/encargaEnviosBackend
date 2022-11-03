import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../../dto/category.dto';
import { Image } from '../../dto/image.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { ImageRepository } from '../image/image.repository';
import { NotificationsRepository } from '../notifications/notifications.repository';
import { searchText } from './searcText.aggregation';

@Injectable()
export class CategoryRepository {
  readonly type = ENTITY.CATEGORY;

  constructor(
    @InjectModel('Category') private categoryDb: Model<Category>,
    private imageRepository: ImageRepository,
    private notificationsRepository: NotificationsRepository,
  ) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, categories] = await Promise.all([
        this.categoryDb.countDocuments(filter),
        this.categoryDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: categories };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter categories Database error',
        e,
      );
    }
  }

  async getOne(id: string): Promise<Category> {
    try {
      const document = await this.categoryDb.findOne({ _id: id }).populate([
        {
          path: 'image',
          match: { status: true },
          select: { url: true },
        },
        {
          path: 'nodes',
          select: { name: true },
        },
        /* {
          path: 'subcategories',
          select: { name: true },
        }, */
      ]);

      if (!document)
        throw new NotFoundException(`Could not find category for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException(
          'findCategory Database error',
          e,
        );
    }
  }

  async create(data: Category, image: Partial<Image>): Promise<boolean> {
    try {
      const newCategory = new this.categoryDb(data);
      const document = await newCategory.save();

      image.parentType = this.type;
      image.parentId = document._id;
      const imageModel = await this.imageRepository.insertImages([image]);
      await this.setTextSearch(document._id);
      return !!(await this.categoryDb.findOneAndUpdate(
        { _id: document._id },
        { image: imageModel[0]._id },
      ));
    } catch (e) {
      throw new InternalServerErrorException(
        'createCategory Database error',
        e,
      );
    }
  }

  async update(
    id: string,
    data: Partial<Category>,
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

      const document = await this.categoryDb.findOneAndUpdate(
        { _id: id },
        { ...data, ...newImage },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find category to update for id: ${id}`,
        );

      if (data.hasOwnProperty('soldOut') && !data.soldOut) {
        this.notificationsRepository.finishSoldOut(document);
        await this.categoryDb.findOneAndUpdate(
          { _id: id },
          { recentProduct: new Date() },
          { new: true },
        );
      }
      if (
        data.name ||
        data.subname ||
        data.price ||
        data.priceDiscount ||
        data.ship ||
        data.subcategory ||
        data.nodes ||
        data.description ||
        data.info
      )
        await this.setTextSearch(id);
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'updateCategory Database error',
        e,
      );
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.categoryDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find category to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'deleteCategory Database error',
        e,
      );
    }
  }

  async setTextSearch(id: string): Promise<void> {
    const categoryQuery = await this.categoryDb.aggregate(searchText(id));

    if (categoryQuery.length === 0) return;
    const texto = this.findTilde(categoryQuery[0].textSearch);
    await this.categoryDb.bulkWrite(
      categoryQuery.map(({ _id, textSearch }) => ({
        updateOne: {
          filter: { _id },
          update: {
            $set: { textSearch: texto },
          },
        },
      })),
    );
  }

  findTilde(a: string): any {
    const b = a.split(' ');
    const newWords = [];
    b.map((word) => {
      for (let i = 0; i < word.length; i++) {
        const caracter = word.charAt(i);
        if (caracter === 'á' || caracter === 'Á') {
          const re = /Á/gi;
          newWords.push(word.replace(re, 'a'));
        } else if (caracter === 'é' || caracter === 'É') {
          const re = /É/gi;
          newWords.push(word.replace(re, 'e'));
        } else if (caracter === 'í' || caracter === 'Í') {
          console.log('Hay caracter: ' + word);
          const re = /Í/gi;
          newWords.push(word.replace(re, 'i'));
        } else if (caracter === 'ó' || caracter === 'Ó') {
          const re = /Ó/gi;
          newWords.push(word.replace(re, 'o'));
        } else if (caracter === 'ú' || caracter === 'Ú') {
          const re = /Ú/gi;
          newWords.push(word.replace(re, 'u'));
        } else {
          if (!newWords.includes(word)) newWords.push(word);
        }
      }
    });
    return newWords.join(' ');
  }
}
