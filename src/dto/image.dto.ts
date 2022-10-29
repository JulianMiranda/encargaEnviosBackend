import { IsMongoId, IsNumber, IsString, IsUrl } from 'class-validator';
import { Document } from 'mongoose';

export class Image extends Document {
  @IsString()
  @IsUrl()
  url?: string;

  @IsString()
  parentType?: string;

  @IsString()
  @IsMongoId()
  parentId?: string;
}
