import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

export const MessageSchema = new mongoose.Schema(
  {
    de: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    para: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: {
      type: String,
      index: true,
    },
  },
  { ...schemaOptions },
);
