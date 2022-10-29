import * as mongoose from 'mongoose';

export const CategoryAnalyticsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
