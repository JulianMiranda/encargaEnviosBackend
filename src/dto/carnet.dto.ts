import { IsString } from 'class-validator';
import { Document } from 'mongoose';

export class Carnet extends Document {
  @IsString()
  name: string;

  @IsString()
  carnet: string;

  @IsString()
  firstLastName: string;

  @IsString()
  secondLastName: string;

  @IsString()
  address: string;

  @IsString()
  deparment: string;

  @IsString()
  floor: string;

  @IsString()
  number: string;

  @IsString()
  firstAccross: string;

  @IsString()
  secondAccross: string;

  @IsString()
  reparto: string;

  @IsString()
  municipio: string;

  @IsString()
  provincia: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  user: string;
}
