import * as mongoose from 'mongoose';
import {schemaOptions} from '../utils/index';

export const ImageSchema = new mongoose.Schema(
	{
		url: String,
		blurHash: String,
		parentType: {type: String, index: true},
		parentId: {type: mongoose.Schema.Types.ObjectId, index: true},
		status: {type: Boolean, default: true, index: true},
	},
	{...schemaOptions},
);
