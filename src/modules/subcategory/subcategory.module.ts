import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from '../image/image.module';
import { SubcategoryController } from './subcategory.controller';
import { SubcategoryRepository } from './subcategory.repository';
import { NotificationsModule } from '../notifications/notifications.module';
import SubcategorySchema from 'src/schemas/subcategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Subcategory',
        schema: SubcategorySchema,
      },
    ]),
    ImageModule,
    NotificationsModule,
  ],
  controllers: [SubcategoryController],
  providers: [SubcategoryRepository],
})
export class SubcategoryModule {}
