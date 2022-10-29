import {
  IsObject,
  IsString,
  IsArray,
  IsMongoId,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Document } from 'mongoose';
import { Image } from './image.dto';
import { Subcategory } from './subcategory.dto';

export class Category extends Document {
  @IsString()
  name: string;

  @IsString()
  subname: string;

  @IsString()
  ship: string;

  @IsObject()
  image: Partial<Image>;

  @IsString()
  nodes: string;

  @IsArray()
  description: Record<string, string>[];

  @IsString()
  @IsMongoId()
  subcategory: string;

  @IsNumber()
  cost: number;

  @IsNumber()
  point: number;

  @IsNumber()
  shop: string;

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

  @IsBoolean()
  soldOut: boolean;

  @IsArray()
  info: string[];

  @IsArray()
  aviableColors: string[];
}
