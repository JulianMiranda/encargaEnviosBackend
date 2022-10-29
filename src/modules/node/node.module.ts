import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import NodeSchema from 'src/schemas/category.schema';
import { ImageModule } from '../image/image.module';
import { NodeController } from './node.controller';
import { NodeRepository } from './node.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Node',
        schema: NodeSchema,
      },
    ]),
    ImageModule,
  ],
  providers: [NodeRepository],
  controllers: [NodeController],
})
export class NodeModule {}
