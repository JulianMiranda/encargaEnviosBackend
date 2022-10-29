import { IsString } from 'class-validator';
import { Document } from 'mongoose';

export class Node extends Document {
  @IsString()
  name: string;
}
