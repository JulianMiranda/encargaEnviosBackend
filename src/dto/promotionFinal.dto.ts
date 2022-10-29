import { IsObject } from 'class-validator';
import { Document } from 'mongoose';
import { Image } from './image.dto';
import { Subcategory } from './subcategory.dto';

export class PromotionFinal extends Document {
  @IsObject()
  image: Partial<Image>;

  @IsObject()
  subcategory: Partial<Subcategory>;
}
