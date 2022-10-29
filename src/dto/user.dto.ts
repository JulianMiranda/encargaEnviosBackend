import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { Document } from 'mongoose';

export class User extends Document {
  @IsString()
  firebaseId: string;

  @IsBoolean()
  reciveNotifications: boolean;

  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  role: string;

  @IsArray()
  permissions: string[];

  @IsString()
  defaultImage: string;

  @IsString()
  notificationTokens: string;

  @IsString()
  theme: string;
}
