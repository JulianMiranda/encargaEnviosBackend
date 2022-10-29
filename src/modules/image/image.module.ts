import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ImageSchema} from '../../schemas/image.schema';
import {ImageController} from './image.controller';
import {ImageRepository} from './image.repository';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Image',
				schema: ImageSchema,
			},
		]),
	],
	controllers: [ImageController],
	providers: [ImageRepository],
	exports: [ImageRepository],
})
export class ImageModule {}
