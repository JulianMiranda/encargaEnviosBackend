import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

export const PromotionSchema = new mongoose.Schema(
  {
    status: { type: Boolean, default: true, index: true },
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    owner: { type: String, default: 'ENCARGA' },
  },
  { ...schemaOptions },
);
