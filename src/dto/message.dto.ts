import {IsString} from 'class-validator';
import {Document} from 'mongoose';

export class Message extends Document {
	@IsString()
	de: string;

	@IsString()
	para: string;

	@IsString()
	message: string;
}
