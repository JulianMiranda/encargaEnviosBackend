import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyShop } from 'src/dto/my-shop.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { ImageRepository } from '../image/image.repository';
import { myShop } from './my-shop.aggregate';
import { Category } from '../../dto/category.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class ShopRepository {
  readonly type = ENTITY.MYSHOP;

  constructor(
    @InjectModel('MyShop') private shopDb: Model<MyShop>,
    @InjectModel('Category') private categoryDb: Model<Category>,
  ) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, shop] = await Promise.all([
        this.shopDb.countDocuments(filter),
        this.shopDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: shop };
    } catch (e) {
      throw new InternalServerErrorException('Filter shop Database error', e);
    }
  }

  async getOne(id: string): Promise<MyShop> {
    try {
      const document = await this.shopDb.findOne({ _id: id }).populate([
        {
          path: 'image',
          match: { status: true },
          select: { url: true },
        },
      ]);

      if (!document)
        throw new NotFoundException(`Could not find shop for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else throw new InternalServerErrorException('findShop Database error', e);
    }
  }

  async getMyShop(id: string): Promise<Array<MyShop>> {
    try {
      const document = await this.shopDb.aggregate<MyShop>(myShop(id));

      if (!document)
        throw new NotFoundException(`Could not find shop for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else throw new InternalServerErrorException('findShop Database error', e);
    }
  }

  async setMyShop(data: MyShop): Promise<boolean> {
    try {
      const { user } = data;
      const previousShop = await this.shopDb.findOne({ user });

      if (previousShop) {
        const document = await this.shopDb.findOneAndUpdate(
          { user },
          { ...data },
        );

        if (!document)
          throw new NotFoundException(
            `Could not find shop to update for id: ${user}`,
          );

        return !!document;
      } else {
        const newShop = new this.shopDb(data);
        const document = await newShop.save();

        return !!document;
      }
    } catch (e) {
      if (e.status === 404) throw e;
      else throw new InternalServerErrorException('findShop Database error', e);
    }
  }

  async checkCategories(userId: string): Promise<any> {
    try {
      const carShop = await this.shopDb.findOne({ user: userId });
      return await Promise.all(
        carShop.car.map(async (carItem) => {
          const category = await this.categoryDb
            .findOne({ _id: carItem.category.id })
            .populate([
              {
                path: 'image',
                match: { status: true },
                select: { url: true },
              },
              {
                path: 'subcategories',
                select: { name: true },
              },
            ]);
          return { ...carItem, category };
        }),
      );
    } catch (e) {
      throw new InternalServerErrorException('Filter shop Database error', e);
    }
  }

  async create(data: MyShop): Promise<boolean> {
    try {
      const newShop = new this.shopDb(data);
      const document = await newShop.save();

      return !!document;
    } catch (e) {
      throw new InternalServerErrorException('createShop Database error', e);
    }
  }

  async update(id: string, data: Partial<MyShop>): Promise<boolean> {
    try {
      const document = await this.shopDb.findOneAndUpdate(
        { _id: id },
        { ...data },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find shop to update for id: ${id}`,
        );

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('updateShop Database error', e);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.shopDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find shop to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('deleteShop Database error', e);
    }
  }
}
