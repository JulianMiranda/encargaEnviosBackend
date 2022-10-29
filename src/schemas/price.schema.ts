import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

export const PriceSchema = new mongoose.Schema(
  {
    mlc: { type: Number, default: 125 },
    mn: { type: Number, default: 100 },
  },
  { ...schemaOptions },
);
