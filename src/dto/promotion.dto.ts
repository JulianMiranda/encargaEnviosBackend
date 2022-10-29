import { IsObject } from 'class-validator';
import { Document } from 'mongoose';
import { Image } from './image.dto';

export class Promotion extends Document {
  @IsObject()
  image: Partial<Image>;
}
