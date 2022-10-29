import * as mongoose from 'mongoose';

export const mostSaleSub = () => [
  { $unwind: '$car' },

  {
    $group: {
      _id: 'User',
      subcategoriesId: { $push: '$car.subcategory' },
    },
  },
  {
    $unwind: {
      path: '$subcategoriesId',
    },
  },
  {
    $group: {
      _id: {
        name: '$subcategoriesId.name',
        id: '$subcategoriesId.id',
        price: '$subcategoriesId.price',
        images: '$subcategoriesId.images',
        description: '$subcategoriesId.description',
        weight: '$subcategoriesId.weight',
        currency: '$subcategoriesId.currency',
        status: '$subcategoriesId.status',
        priceGalore: '$subcategoriesId.priceGalore',
      },
      count: { $sum: 1 },
    },
  },

  { $sort: { count: -1 } },
  { $limit: 10 },

  /*   {
    $group: {
      _id: { user: '$user' },
      carro: { $addToSet: '$car.subcategory' },
      count: { $sum: 1 },
    },
  }, */
];

/* {
    $group: {
      _id: { user: '$user' },
      compras: { $addToSet: '$_id' },
      count: { $sum: 1 },
    },
  },
  {
    $match: {
      count: { $gt: 1 },
    },
  },
  { $sort: { count: -1 } }, */

/* { $unwind: '$car' },

  {
    $group: {
      _id: 'User',
      subcategoriesId: { $push: '$car.subcategory.id' },
    },
  },
  {
    $unwind: {
      path: '$subcategoriesId',
    },
  },
  {
    $group: {
      _id: '$subcategoriesId',
      count: { $sum: 1 },
    },
  },
  { $sort: { count: -1 } },
  { $limit: 10 },

  {
    $lookup: {
      from: 'subcategories',
      let: { subcategoriesId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: ['$_id', '$$subcategoriesId'],
                },
              ],
            },
          },
        },
        {
          $project: {
            id: '$_id',
            _id: 0,
            name: 1,
          },
        },
      ],
      as: 'onLine',
    },
  }, */
