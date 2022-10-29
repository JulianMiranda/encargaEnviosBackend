import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

export const MyShopSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    car: [],
    /* car: [
      {
        type: {
          cantidad: Number,
          subcategory: mongoose.Schema.Types.ObjectId,
          ref: 'Subcategory',
        },
        index: true,
      },
    ], */
  },
  { ...schemaOptions },
);
