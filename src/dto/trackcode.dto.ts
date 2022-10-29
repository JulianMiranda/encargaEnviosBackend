import { IsMongoId, IsString } from 'class-validator';
import { Document } from 'mongoose';

export class Trackcode extends Document {
  @IsString()
  code: string[];

  @IsString()
  @IsMongoId()
  order: string;

  @IsString()
  @IsMongoId()
  user: string;

  @IsString()
  state: string;
}
