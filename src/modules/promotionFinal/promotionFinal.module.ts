import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from '../image/image.module';
import { PromotionFinalController } from './promotionFinal.controller';
import { PromotionFinalRepository } from './promotionFinal.repository';
import { PromotionFinalSchema } from '../../schemas/promotionFinal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'PromotionFinal',
        schema: PromotionFinalSchema,
      },
    ]),
    ImageModule,
  ],
  providers: [PromotionFinalRepository],
  controllers: [PromotionFinalController],
})
export class PromotionFinalModule {}
