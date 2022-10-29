import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceSchema } from 'src/schemas/price.schema';
import { PriceController } from './price.controller';
import { PriceRepository } from './price.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Price',
        schema: PriceSchema,
      },
    ]),
  ],
  providers: [PriceRepository],
  controllers: [PriceController],
})
export class PriceModule {}
