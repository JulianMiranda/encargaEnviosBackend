import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AnalyticsRepository {
  constructor(
    @InjectModel('CategoryAnalytics') private categoryAnalyticsDb: Model<any>,
  ) {}

  setCategoryAnalytics(user: string, category: string) {
    try {
      const newDocument = new this.categoryAnalyticsDb({ user, category });
      newDocument.save();
    } catch (e) {
      throw new InternalServerErrorException(
        'setCategoryAnalytics Database error',
        e,
      );
    }
  }
}
