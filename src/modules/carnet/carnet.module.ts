import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CarnetSchema from 'src/schemas/carnet.schema';
import { CarnetController } from './carnet.controller';
import { CarnetRepository } from './carnet.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Carnet',
        schema: CarnetSchema,
      },
    ]),
  ],
  providers: [CarnetRepository],
  controllers: [CarnetController],
})
export class CarnetModule {}
