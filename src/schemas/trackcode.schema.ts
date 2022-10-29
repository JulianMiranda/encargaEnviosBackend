import * as mongoose from 'mongoose';
import { STATETRACKCODE } from 'src/enums/statetrackcode.enum';
import { schemaOptions } from '../utils/index';

const TrackcodeodeSchema = new mongoose.Schema(
  {
    code: [{ type: String }],
    state: {
      type: String,
      default: STATETRACKCODE.CONFIRMED,
      index: true,
      enum: [
        STATETRACKCODE.CONFIRMED,
        STATETRACKCODE.AGENCY,
        STATETRACKCODE.AIMS,
        STATETRACKCODE.ADUECU,
        STATETRACKCODE.COPAAIR,
        STATETRACKCODE.ADUANACUB,
      ],
    },
    status: { type: Boolean, default: true, index: true },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: 'Order',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: 'User',
    },
  },
  { ...schemaOptions },
);

export default TrackcodeodeSchema;
