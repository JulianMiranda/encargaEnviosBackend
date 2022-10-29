import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';
import CategorySchema from '../../schemas/category.schema';
import SubcategorySchema from '../../schemas/subcategory.schema';
import { OrderSchema } from '../../schemas/order.schema';
import { QueriesController } from './queries.controller';
import { QueriesRepository } from './queries.repository';
import { CategoryAnalyticsSchema } from 'src/schemas/category-analytics.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Subcategory',
        schema: SubcategorySchema,
      },
      {
        name: 'Category',
        schema: CategorySchema,
      },
      {
        name: 'Order',
        schema: OrderSchema,
      },
      {
        name: 'CategoryAnalytics',
        schema: CategoryAnalyticsSchema,
      },
    ]),

    NotificationsModule,
  ],

  controllers: [QueriesController],
  providers: [QueriesRepository],
})
export class QueriesModule {}
