import * as mongoose from 'mongoose';

export const mostSale = (userId) => [
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
      _id: '$subcategoriesId.id',
      images: { $addToSet: '$subcategoriesId.images.url' },
      name: { $addToSet: '$subcategoriesId.name' },
      price: { $addToSet: '$subcategoriesId.price' },
      description: { $addToSet: '$subcategoriesId.description' },
      weight: { $addToSet: '$subcategoriesId.weight' },
      currency: { $addToSet: '$subcategoriesId.currency' },
      status: { $addToSet: '$subcategoriesId.status' },
      priceGalore: { $addToSet: '$subcategoriesId.priceGalore' },
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
