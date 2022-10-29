import * as mongoose from 'mongoose';

export const Test = (userId) => [
  /*   { $match: { user: mongoose.Types.ObjectId(userId) } }, */
  {
    $lookup: {
      from: 'categoryanalytics',
      let: { category_id: '$_id', user_id: mongoose.Types.ObjectId(userId) },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$category', '$$category_id'] },
                { $eq: ['$user', '$$user_id'] },
              ],
            },
          },
        },
        { $project: { _id: 1 } },
      ],
      as: 'viewsAnalytics',
    },
  },
  { $addFields: { viewsCount: { $size: '$viewsAnalytics' } } },
  {
    $group: {
      _id: null,
      categories: { $push: '$$ROOT' },
      maxViews: { $max: '$viewsCount' },
    },
  },
  { $project: { _id: 0 } },
  { $unwind: '$categories' },
  {
    $addFields: {
      'categories.viewScore': {
        $cond: {
          if: { $eq: ['$maxViews', 0] },
          then: 0,
          else: {
            $divide: [
              { $multiply: [100, '$categories.viewsCount'] },
              '$maxViews',
            ],
          },
        },
      },
    },
  },
  { $replaceRoot: { newRoot: '$categories' } },
  { $sort: { viewScore: -1 } },

  {
    $lookup: {
      from: 'categories',
      let: { category_id: '$_id', node_id: '$node' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$node', '$$node_id'] }],
            },
          },
        },
        { $project: { _id: 1 } },
      ],
      as: 'categoriesCommon',
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
    $group: {
      _id: null,
      categoriesCommon: { $addToSet: '$$ROOT' },
    },
  },
  { $project: { _id: 0 } },
  { $unwind: '$categoriesCommon' },
  { $limit: 10 },
  { $replaceRoot: { newRoot: '$categoriesCommon' } },
];
