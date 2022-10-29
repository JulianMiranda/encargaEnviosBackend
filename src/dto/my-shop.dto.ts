import { IsArray, IsMongoId, IsObject, IsString } from 'class-validator';
import { Document } from 'mongoose';

export class MyShop extends Document {
  @IsString()
  @IsMongoId()
  user: string;

  @IsArray()
  car: any[];
}
