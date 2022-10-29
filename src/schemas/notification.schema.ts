import * as mongoose from 'mongoose';
import { NOTIFICATION } from 'src/enums/notification.enum';

export const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    title: String,
    body: String,
    type: {
      type: String,
      enum: [NOTIFICATION.ORDER],
    },
    identifier: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
