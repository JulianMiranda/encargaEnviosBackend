import * as mongoose from 'mongoose';
import { CURRENCY } from 'src/enums/currency.enum';
import { schemaOptions } from '../utils/index';

const TransferSchema = new mongoose.Schema(
  {
    status: { type: Boolean, default: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalPayment: Number,
    idPayment: String,
    currency: {
      type: String,
      enum: [CURRENCY.CUP, CURRENCY.MLC],
    },
    changeValue: Number,
  },
  { ...schemaOptions },
);

export default TransferSchema;
