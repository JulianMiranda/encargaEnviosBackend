import * as mongoose from 'mongoose';

export const RecommendedCategories = (
  userId: string,
  limit: number,
  skip: number,
) => [
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
  { $match: { status: { $eq: true } } },
  { $skip: skip },
  { $limit: limit },
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

  {
    $project: {
      name: 1,
      ship: 1,
      subname: 1,
      nodes: 1,
      price: 1,
      priceDiscount: 1,
      aviableColors: 1,
      info: 1,
      image: 1,
      soldOut: 1,
      description: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1,
      subcategories: 1,
      point: 1,
      id: '$_id',
      _id: 0,
    },
  },
];
