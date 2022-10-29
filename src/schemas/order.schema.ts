import * as mongoose from 'mongoose';
import { Price } from 'src/dto/price.dto';
import { Relleno } from 'src/dto/relleno.dto';
import { schemaOptions } from '../utils/index';

export const OrderSchema = new mongoose.Schema(
  {
    status: { type: Boolean, default: true, index: true },
    owner: { type: String, default: 'Julian' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    trackcode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trackcode',
      index: true,
    },

    codes: [
      {
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
          index: true,
        },
        code: { type: String, default: '' },
        ship: { type: String },
      },
    ],
    car: [],
    cost: Number,
    cantPaqOS: {},
    totalPaqReCalc: Number,
    prices: { type: { Price }, default: {} },
    selectedCarnet: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Carnet', index: true },
    ],
    description: String,
    relleno: { type: { Relleno }, index: true, default: {} },
    currency: { type: String, default: 'USD' },
    /* car: [
      {
        cantidad: Number,
        subcategory: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
      },
    ], */
  },
  { ...schemaOptions },
);
