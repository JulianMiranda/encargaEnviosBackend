import * as mongoose from 'mongoose';
import { schemaOptions } from '../utils/index';

const NodeSchema = new mongoose.Schema(
  {
    name: String,
    status: { type: Boolean, default: true, index: true },
  },
  { ...schemaOptions },
);

export default NodeSchema;
