import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from '../image/image.module';
import { PromotionController } from './promotion.controller';
import { PromotionRepository } from './promotion.repository';
import { PromotionSchema } from '../../schemas/promotion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Promotion',
        schema: PromotionSchema,
      },
    ]),
    ImageModule,
  ],
  providers: [PromotionRepository],
  controllers: [PromotionController],
})
export class PromotionModule {}
