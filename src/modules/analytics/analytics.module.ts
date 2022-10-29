import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryAnalyticsSchema } from '../../schemas/category-analytics.schema';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsRepository } from './analytics.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'CategoryAnalytics',
        schema: CategoryAnalyticsSchema,
      },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsRepository],
})
export class AnalyticsModule {}
