import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Document } from 'mongoose';
import { Image } from './image.dto';

export class Subcategory extends Document {
  @IsString()
  name: string;

  @IsArray()
  images: Array<Partial<Image>>;

  @IsArray()
  deleteImages: string[];

  @IsNumber()
  weight: number;

  @IsArray()
  description: Record<string, string>[];

  @IsNumber()
  cost: number;

  @IsNumber()
  price: number;

  @IsNumber()
  priceGalore: number;

  @IsNumber()
  priceGaloreDiscount: number;

  @IsNumber()
  priceDiscount: number;

  @IsString()
  currency: string;

  @IsNumber()
  stock: number;

  @IsArray()
  aviableSizes: string[];

  @IsArray()
  aviableColors: string[];

  @IsBoolean()
  soldOut: boolean;

  @IsDate()
  createdAt: Date;
}
