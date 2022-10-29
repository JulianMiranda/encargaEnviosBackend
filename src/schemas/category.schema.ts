import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';
import { SHIP } from '../enums/ship.enum';

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    subname: String,
    shop: String,
    ship: {
      type: String,
      enum: [SHIP.AEREO, SHIP.MARITIMO],
      default: SHIP.AEREO,
    },
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    subcategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
    ],
    nodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        ref: 'Node',
      },
    ],
    aviableColors: [],
    description: [],
    info: [{ type: String }],
    textSearch: { type: String, index: true },
    status: { type: Boolean, default: true, index: true },
    cost: { type: Number, default: 0 },
    point: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
    priceGalore: { type: Number, default: 0 },
    priceDiscount: { type: Number, default: 0 },
    priceGaloreDiscount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    soldOut: { type: Boolean, default: false, index: true },
    recentProduct: { type: Date, default: new Date(), index: true },
  },
  { ...schemaOptions },
);

CategorySchema.index({ textSearch: 'text' });

export default CategorySchema;
