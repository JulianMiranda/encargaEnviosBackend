import * as mongoose from 'mongoose';

export const recentSubcategories = (user: string) => [
	{$match: {user: mongoose.Types.ObjectId(user)}},
	{
		$group: {
			_id: 'subcategory.name',
			subcategory: {$addToSet: '$subcategory'},
		},
	},
	{
		$lookup: {
			from: 'subcategories',
			let: {subcategory: '$subcategory'},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [
								{$in: ['$_id', '$$subcategory']},
								{$eq: ['$status', true]},
							],
						},
					},
				},
				{
					$lookup: {
						from: 'owners',
						let: {id: '$_id'},
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{$in: ['$$id', '$subcategories']},
											{$eq: ['$status', true]},
										],
									},
								},
							},
							{$limit: 10},
							{
								$lookup: {
									from: 'users',
									let: {user: '$user'},
									pipeline: [
										{
											$match: {
												$expr: {
													$and: [
														{$eq: ['$_id', '$$user']},
														{$eq: ['$status', true]},
													],
												},
											},
										},
										{
											$project: {
												id: '$_id',
												_id: 0,
												online: 1,
											},
										},
									],
									as: 'onLine',
								},
							},
							{
								$unwind: {
									path: '$onLine',
									preserveNullAndEmptyArrays: true,
								},
							},
							{$addFields: {online: '$onLine.online'}},
							{
								$lookup: {
									from: 'opportunities',
									let: {owner: '$_id'},
									pipeline: [
										{
											$match: {
												$expr: {
													$and: [
														{$eq: ['$owner', '$$owner']},
														{$eq: ['$status', true]},
													],
												},
											},
										},
										{
											$project: {
												id: '$_id',
												_id: 0,
											},
										},
									],
									as: 'previosWork',
								},
							},
							{
								$lookup: {
									from: 'comments',
									let: {owner: '$_id'},
									pipeline: [
										{
											$match: {
												$expr: {
													$and: [
														{$eq: ['$owner', '$$owner']},
														{$eq: ['$status', true]},
													],
												},
											},
										},
										{$sort: {createdAt: -1}},
										{$limit: 1},
										{
											$project: {
												_id: 0,
												text: 1,
											},
										},
									],
									as: 'lastComment',
								},
							},
							{
								$unwind: {
									path: '$lastComment',
									preserveNullAndEmptyArrays: true,
								},
							},
							{$addFields: {lastComment: '$lastComment.text'}},
							{
								$lookup: {
									from: 'images',
									let: {image: '$image'},
									pipeline: [
										{
											$match: {
												$expr: {
													$and: [
														{$eq: ['$_id', '$$image']},
														{$eq: ['$status', true]},
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
									line: 1,
									name: 1,
									image: 1,
									ratingAvg: 1,
									ratingStars: 1,
									email: 1,
									phone: 1,
									description: 1,
									address: 1,
									city: 1,
									region: 1,
									country: 1,
									online: 1,
									lastComment: 1,
									experience: 1,
									payment: 1,
									previosWork: {$size: '$previosWork'},
									id: '$_id',
									_id: 0,
								},
							},
						],
						as: 'nearOwners',
					},
				},
				{
					$lookup: {
						from: 'images',
						let: {image: '$image'},
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{$eq: ['$_id', '$$image']},
											{$eq: ['$status', true]},
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
						image: 1,
						nearOwners: 1,
						id: '$_id',
						_id: 0,
					},
				},
			],
			as: 'subcategory',
		},
	},
	{$unwind: '$subcategory'},
	{$replaceRoot: {newRoot: '$subcategory'}},
];
