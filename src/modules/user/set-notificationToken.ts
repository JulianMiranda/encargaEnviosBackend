import * as mongoose from 'mongoose';

export const setNotificationToken = (
  userId: string,
  notificationToken: string,
) => [
  { $match: { user: mongoose.Types.ObjectId(userId) } },
  {
    $notificationTokens: { addToSet: notificationToken },
  },
];
