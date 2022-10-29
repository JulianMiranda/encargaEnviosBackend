import { IsString, IsNumber } from 'class-validator';
import { Document } from 'mongoose';

export class Transfer extends Document {
  @IsString()
  user: string;

  @IsNumber()
  totalPayment: number;

  @IsString()
  idPayment: string;

  @IsString()
  idPaymentIntent: string;

  @IsString()
  currency: string;

  @IsString()
  cubaCurrency: string;

  @IsNumber()
  changeValue: number;
}
