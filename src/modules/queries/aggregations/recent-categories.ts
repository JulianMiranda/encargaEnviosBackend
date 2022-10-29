import * as mongoose from 'mongoose';

export const recentCategories = (userId: string) => [
  { $match: { user: mongoose.Types.ObjectId(userId) } },
  {
    $lookup: {
      from: 'categories',
      let: { category: '$category' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$_id', '$$category'] },
                { $eq: ['$status', true] },
              ],
            },
          },
        },
        {
          $project: {
            name: 1,
            image: 1,
            subcategories: 1,
            id: '$_id',
            _id: 0,
          },
        },
      ],
      as: 'category',
    },
  },
  { $unwind: '$category' },
  { $group: { _id: '$category', createdAt: { $last: '$createdAt' } } },
  { $sort: { createdAt: -1 } },
  { $limit: 15 },
  { $replaceRoot: { newRoot: '$_id' } },
  {
    $lookup: {
      from: 'images',
      let: { image: '$image' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$_id', '$$image'] }, { $eq: ['$status', true] }],
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
    $lookup: {
      from: 'subcategories',
      let: { subcategories: '$subcategories' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $in: ['$_id', '$$subcategories'] },
                { $eq: ['$status', true] },
              ],
            },
          },
        },
        {
          $project: {
            name: 1,
            id: '$_id',
            _id: 0,
          },
        },
      ],
      as: 'subcategories',
    },
  },
  { $group: { _id: 'RECIENTES', categories: { $push: '$$ROOT' } } },
  { $project: { title: '$_id', categories: 1, _id: 0 } },
];
