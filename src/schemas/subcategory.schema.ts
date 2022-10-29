import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

const SubcategorySchema = new mongoose.Schema(
  {
    name: { type: String, index: true },
    description: [],
    cost: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    priceGalore: { type: Number, default: 0 },
    priceDiscount: { type: Number, default: 0 },
    priceGaloreDiscount: { type: Number, default: 0 },
    weight: { type: Number, default: 1 },
    stock: { type: Number, default: 0 },
    aviableSizes: [],
    aviableColors: [],
    currency: { type: String, default: 'USD' },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    status: { type: Boolean, default: true, index: true },
    soldOut: { type: Boolean, default: false, index: true },
    recentProduct: { type: Date, default: new Date(), index: true },
  },
  { ...schemaOptions },
);
SubcategorySchema.index({ name: 'text' });

export default SubcategorySchema;
