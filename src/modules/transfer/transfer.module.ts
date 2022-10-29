import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import TransferSchema from 'src/schemas/transfer.schema';
import { ImageModule } from '../image/image.module';
import { TransferController } from './transfer.controller';
import { TransferRepository } from './transfer.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Transfer',
        schema: TransferSchema,
      },
    ]),
    ImageModule,
  ],
  providers: [TransferRepository],
  controllers: [TransferController],
})
export class TransferModule {}
