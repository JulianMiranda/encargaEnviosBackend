import * as mongoose from 'mongoose';
import { THEME } from 'src/enums/theme.enum';
import { schemaOptions } from '../utils/index';

export const UserSchema = new mongoose.Schema(
  {
    firebaseId: String,
    name: { type: String, index: true },

    email: String,
    phone: String,
    role: String,
    defaultImage: String,
    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    status: { type: Boolean, default: true, index: true },
    reciveNotifications: { type: Boolean, default: true, index: true },
    notificationTokens: [{ type: String }],
    theme: {
      type: String,
      default: THEME.DEFAULT,
      enum: [THEME.DEFAULT, THEME.DARK, THEME.LIGHT],
    },
  },
  { ...schemaOptions },
);
