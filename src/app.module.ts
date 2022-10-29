import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { MONGO_CONNECTION, STRIPE_API_KEY } from './config/config';
import { GetUserMiddleware } from './middlewares/get-user.middleware';
import { FirebaseService } from './services/firebase.service';
import { UserController } from './modules/user/user.controller';
import { UserModule } from './modules/user/user.module';
import { RoleController } from './modules/role/role.controller';
import { RoleModule } from './modules/role/role.module';
import { ImageController } from './modules/image/image.controller';
import { ImageModule } from './modules/image/image.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { TransferController } from './modules/transfer/transfer.controller';
import { SendGridService } from './services/sendgrid.service';
import { MessageController } from './modules/message/message.controller';
import { MessageModule } from './modules/message/message.module';
import { PriceModule } from './modules/price/price.module';
import { PriceController } from './modules/price/price.controller';
import { StripeModule } from './modules/stripe/stripe.module';
import { CategoryModule } from './modules/category/category.module';
import { CategoryController } from './modules/category/category.controller';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { SubcategoryController } from './modules/subcategory/subcategory.controller';
import { NodeModule } from './modules/node/node.module';
import { NodeController } from './modules/node/node.controller';
import { CarnetModule } from './modules/carnet/carnet.module';
import { ShopModule } from './modules/shop/shop.module';
import { OrderModule } from './modules/order/order.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { PromotionFinalModule } from './modules/promotionFinal/promotionFinal.module';
import { CarnetController } from './modules/carnet/carnet.controller';
import { ShopController } from './modules/shop/shop.controller';
import { OrderController } from './modules/order/order.controller';
import { PromotionController } from './modules/promotion/promotion.controller';
import { PromotionFinalController } from './modules/promotionFinal/promotionFinal.controller';
import { QueriesModule } from './modules/queries/queries.module';
import { QueriesController } from './modules/queries/queries.controller';
import { AnalyticsController } from './modules/analytics/analytics.controller';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { TrackcodeModule } from './modules/trackcode/trackcode.module';
import { TrackcodeController } from './modules/trackcode/trackcode.controller';
import { ScheduleService } from './services/schedule.service';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
    StripeModule.forRoot(STRIPE_API_KEY, {
      apiVersion: '2020-08-27',
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    SubcategoryModule,
    MessageModule,
    RoleModule,
    TrackcodeModule,
    ImageModule,
    TransferModule,
    PriceModule,
    NodeModule,
    QueriesModule,
    AnalyticsModule,
    CarnetModule,
    ShopModule,
    OrderModule,
    PromotionModule,
    PromotionFinalModule,
  ],
  controllers: [AppController],
  providers: [FirebaseService, SendGridService, ScheduleService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(GetUserMiddleware)
      .forRoutes(
        AuthController,
        UserController,
        RoleController,
        ImageController,
        TransferController,
        CategoryController,
        SubcategoryController,
        PriceController,
        NodeController,
        CarnetController,
        QueriesController,
        TrackcodeController,
        AnalyticsController,
        ShopController,
        OrderController,
        PromotionController,
        MessageController,
        PromotionFinalController,
      );
  }
}
