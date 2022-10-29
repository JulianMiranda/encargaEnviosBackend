import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Promise } from 'mongoose';
import { Category } from 'src/dto/category.dto';
import { MongoQuery } from 'src/dto/mongo-query.dto';
import { Subcategory } from 'src/dto/subcategory.dto';
import { NOTIFICATION } from 'src/enums/notification.enum';
import { NotificationsRepository } from '../notifications/notifications.repository';
import { mostSaleLastMonth } from './aggregations/most-sale-last-month';
import { recentCategories } from './aggregations/recent-categories';
import { RecommendedCategories } from './aggregations/recommended-categories';
import { RecommendedCategoriesUnAuth } from './aggregations/recommended-categories-unauth';
import { Test } from './aggregations/test';

@Injectable()
export class QueriesRepository {
  constructor(
    @InjectModel('Subcategory') private subcategoryDb: Model<Subcategory>,
    @InjectModel('Category') private categoryDb: Model<Category>,
    @InjectModel('Order') private orderDb: Model<any>,
    @InjectModel('CategoryAnalytics') private categoryAnalyticsDb: Model<any>,
    private notificationsRepository: NotificationsRepository,
  ) {}

  async getHome(data: any): Promise<any> {
    try {
      const today = new Date();
      const month = new Date();
      month.setDate(today.getDate() - 30);

      return Promise.all([
        this.categoryDb
          .find({
            $expr: {
              $and: [
                { $ne: ['$priceDiscount', 0] },
                { $eq: ['$status', true] },
              ],
            },
          })
          .sort({ updatedAt: -1 })
          .limit(5)
          .populate([
            {
              path: 'image',
              match: { status: true },
              select: { url: true },
              options: { sort: { updatedAt: -1 } },
            },
            {
              path: 'subcategories',
              select: { name: true },
            },
          ]),
        this.orderDb.aggregate(mostSaleLastMonth(month)),
        this.categoryDb
          .find({
            $expr: {
              $and: [{ $eq: ['$status', true] }, { $eq: ['$soldOut', false] }],
            },
          })
          .sort({ recentProduct: -1 })
          .limit(20)
          .populate([
            {
              path: 'image',
              match: { status: true },
              select: { url: true },
              options: { sort: { updatedAt: -1 } },
            },
            {
              path: 'subcategories',
              select: { name: true },
            },
          ]),
      ]);
    } catch (e) {
      throw new InternalServerErrorException('getHome query error', e);
    }
  }

  async getRecentCategories(userId: string): Promise<any> {
    try {
      return this.categoryAnalyticsDb.aggregate(recentCategories(userId));
    } catch (e) {
      throw new InternalServerErrorException(
        'getRecentCategories query error',
        e,
      );
    }
  }

  async getRecomendedCategories(
    query: MongoQuery,
    userId: string,
  ): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;

      const [count, categories] = await Promise.all([
        this.categoryDb.countDocuments(filter),
        this.categoryDb.aggregate(RecommendedCategories(userId, limit, skip)),
      ]);

      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: categories };
    } catch (e) {
      throw new InternalServerErrorException(
        'getRecentCategories query error',
        e,
      );
    }
  }

  async getRecomendedCategoriesUnAuth(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;

      const [count, categories] = await Promise.all([
        this.categoryDb.countDocuments(filter),
        this.categoryDb.aggregate(
          RecommendedCategoriesUnAuth('62db9b2afa1ed900169f181d', limit, skip),
        ),
      ]);

      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: categories };
    } catch (e) {
      throw new InternalServerErrorException(
        'getRecentCategories query error',
        e,
      );
    }
  }

  async getSearchByText(query: MongoQuery): Promise<any> {
    console.log(query);
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      /*   const filter = this.transformFilter({}, search); */
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
      throw new InternalServerErrorException('getSearchByText query error', e);
    }
  }

  async test(userId: string): Promise<any> {
    try {
      return this.categoryDb.aggregate(Test(userId));
    } catch (e) {
      throw new InternalServerErrorException('test query error', e);
    }
  }

  async notificationAllUsers(): Promise<any> {
    try {
      return await this.notificationsRepository.allUsers(NOTIFICATION.ALLUSERS);
    } catch (e) {
      throw new InternalServerErrorException('test query error', e);
    }
  }
}
