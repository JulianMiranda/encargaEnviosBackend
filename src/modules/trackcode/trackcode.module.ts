import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import TrackcodeSchema from 'src/schemas/trackcode.schema';
import { TrackcodeController } from './trackcode.controller';
import { TrackcodeRepository } from './trackcode.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Trackcode',
        schema: TrackcodeSchema,
      },
    ]),
  ],
  providers: [TrackcodeRepository],
  controllers: [TrackcodeController],
  exports: [TrackcodeRepository],
})
export class TrackcodeModule {}
