export const searchByText = (textSearch: string) => [
  {
    $match: {
      $text: { $search: textSearch },
      status: true,
    },
  },

  /* 
  {
    $lookup: {
      from: 'images',
      let: { image: '$unit.image' },
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
      as: 'unit.image',
    },
  },
  {
    $unwind: {
      path: '$unit.image',
      preserveNullAndEmptyArrays: true,
    },
  }, */
];
