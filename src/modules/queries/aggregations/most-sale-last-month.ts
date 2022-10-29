import * as mongoose from 'mongoose';

export const mostSaleLastMonth = (month) => [
  {
    $match: {
      $expr: {
        $and: [{ $gt: ['$createdAt', month] }],
      },
    },
  },

  { $unwind: '$car' },

  {
    $group: {
      _id: '$car.category.id',
      count: { $sum: 1 },
    },
  },
  { $sort: { count: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: 'categories',
      let: { catObjctId: { $toObjectId: '$_id' } },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$_id', '$$catObjctId'] },
                { $eq: ['$status', true] },
              ],
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
            id: '$_id',
            _id: 0,
            name: 1,
            subname: 1,
            description: 1,
            image: 1,
            status: 1,
            currency: 1,
            subcategories: 1,
            price: 1,
            priceDiscount: 1,
            priceGaloreDiscount: 1,
            createdAt: 1,
            updatedAt: 1,
            priceGalore: 1,
            soldOut: 1,
            nodes: 1,
            ship: 1,
          },
        },
      ],
      as: 'mostSaleCategory',
    },
  },
  { $unwind: '$mostSaleCategory' },
  {
    $project: {
      mostSaleCategory: 1,
    },
  },
];
