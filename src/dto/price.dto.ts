import { IsNumber } from 'class-validator';
import { Document } from 'mongoose';

export class Price extends Document {
  @IsNumber()
  mlc: number;

  @IsNumber()
  mn: number;
}
