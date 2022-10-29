import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MyShopSchema } from 'src/schemas/myShop.schema';
import { OrderSchema } from 'src/schemas/order.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { UserSchema } from '../../schemas/user.schema';
import TrackcodeSchema from 'src/schemas/trackcode.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: 'Order',
        schema: OrderSchema,
      },
      {
        name: 'MyShop',
        schema: MyShopSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Trackcode',
        schema: TrackcodeSchema,
      },
    ]),
    NotificationsModule,
  ],
  providers: [OrderRepository],
  controllers: [OrderController],
})
export class OrderModule {}
