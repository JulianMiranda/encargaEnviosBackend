export const findUser = () => [
  {
    $group: {
      _id: 'Usuarios',
      users: { $addToSet: '$de' },
      users2: { $addToSet: '$para' },
    },
  },
  { $project: { chats: { $setUnion: ['$users', '$users2'] } } },

  {
    $lookup: {
      from: 'users',
      let: { chats: '$chats' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $in: ['$_id', '$$chats'] }, { $eq: ['$status', true] }],
            },
          },
        },
        {
          $lookup: {
            from: 'images',
            let: { image: '$image' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$image'] },
                      { $eq: ['$status', true] },
                    ],
                  },
                },
              },
              {
                $project: {
                  url: 1,
                  blurHash: 1,
                  id: '$_id',
                  _id: 0,
                },
              },
            ],
            as: 'image',
          },
        },
        {
          $unwind: {
            path: '$image',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            name: 1,
            status: 1,
            reciveNotifications: 1,
            notificationTokens: 1,
            theme: 1,
            role: 1,
            email: 1,
            createdAt: 1,
            updatedAt: 1,
            image: 1,
            id: '$_id',
            _id: 0,
          },
        },
      ],

      as: 'user',
    },
  },

  {
    $unwind: {
      path: '$user',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $group: {
      _id: 'Usuarios',
      users: { $addToSet: '$user' },
    },
  },
  { $unwind: '$users' },
  { $replaceRoot: { newRoot: '$users' } },
];
