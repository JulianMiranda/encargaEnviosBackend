import { IsBoolean, IsNumber } from 'class-validator';
import { Document } from 'mongoose';

export class Relleno extends Document {
  @IsBoolean()
  noone: boolean;

  @IsBoolean()
  refresco: boolean;

  @IsBoolean()
  maquina: boolean;

  @IsBoolean()
  golosina: boolean;

  @IsBoolean()
  plantilla: boolean;

  @IsBoolean()
  lapicero: boolean;
}
