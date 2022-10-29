import * as mongoose from 'mongoose';
export const searchText = (id: string) => [
  { $match: { _id: mongoose.Types.ObjectId(id) } },
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
    $lookup: {
      from: 'nodes',
      let: { nodes: '$nodes' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $in: ['$_id', '$$nodes'] }, { $eq: ['$status', true] }],
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
      as: 'nodes',
    },
  },
  {
    $addFields: {
      cont: {
        $reduce: {
          input: '$description',
          initialValue: '',
          in: {
            $cond: {
              if: {
                $eq: [{ $indexOfArray: ['$description', '$$this'] }, 0],
              },
              then: { $concat: ['$$value', '$$this.content'] },
              else: { $concat: ['$$value', ' ', '$$this.content'] },
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      title: {
        $reduce: {
          input: '$description',
          initialValue: '',
          in: {
            $cond: {
              if: {
                $eq: [{ $indexOfArray: ['$description', '$$this'] }, 0],
              },
              then: { $concat: ['$$value', '$$this.title'] },
              else: { $concat: ['$$value', ' ', '$$this.title'] },
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      subc: {
        $reduce: {
          input: '$subcategories',
          initialValue: '',
          in: {
            $cond: {
              if: {
                $eq: [{ $indexOfArray: ['$subcategories', '$$this'] }, 0],
              },
              then: { $concat: ['$$value', '$$this.name'] },
              else: { $concat: ['$$value', ' ', '$$this.name'] },
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      nod: {
        $reduce: {
          input: '$nodes',
          initialValue: '',
          in: {
            $cond: {
              if: {
                $eq: [{ $indexOfArray: ['$nodes', '$$this'] }, 0],
              },
              then: { $concat: ['$$value', '$$this.name'] },
              else: { $concat: ['$$value', ' ', '$$this.name'] },
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      values: {
        $reduce: {
          input: '$info',
          initialValue: '',
          in: {
            $cond: {
              if: { $eq: [{ $indexOfArray: ['$info', '$$this'] }, 0] },
              then: { $concat: ['$$value', '$$this'] },
              else: { $concat: ['$$value', ' ', '$$this'] },
            },
          },
        },
      },
    },
  },

  {
    $project: {
      cont: 1,
      title: 1,
      subc: 1,
      nod: 1,
      subcategories: 1,
      textSearch: {
        $concat: [
          { $ifNull: ['$name', ''] },
          ' ',
          { $ifNull: ['$subname', ''] },
          ' ',
          { $ifNull: [{ $toString: '$price' }, ''] },
          ' ',
          { $ifNull: [{ $toString: '$priceDiscount' }, ''] },
          ' ',
          { $ifNull: ['$cont', ''] },
          ' ',
          { $ifNull: ['$title', ''] },
          ' ',
          { $ifNull: ['$values', ''] },
          ' ',
          { $ifNull: ['$subc', ''] },
          ' ',
          { $ifNull: ['$nod', ''] },
          ' ',
          { $ifNull: ['$ship', ''] },
        ],
      },
    },
  },
];
