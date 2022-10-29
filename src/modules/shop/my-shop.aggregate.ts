import * as mongoose from 'mongoose';

export const myShop = (userId: string) => [
  { $match: { user: mongoose.Types.ObjectId(userId) } },

  /*  { $project: { user: 1, car: 1, createdAt: 0, updatedAt: 0 } }, */
];
