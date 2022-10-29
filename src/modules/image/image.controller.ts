import {Body, Controller, Delete, Post, UseGuards} from '@nestjs/common';
import {Image} from 'src/dto/image.dto';

import {ImageRepository} from './image.repository';

@Controller('images')
export class ImageController {
	constructor(private imageRepository: ImageRepository) {}

	@Post()
	getImages(@Body() data: Partial<Image>): Promise<Image[]> {
		return this.imageRepository.getImages(data);
	}

	@Post()
	insertImages(@Body() data: any): Promise<Image[]> {
		const {images} = data;
		return this.imageRepository.insertImages(images);
	}

	@Delete()
	deleteImages(@Body() data: any): Promise<boolean> {
		const {images} = data;
		return this.imageRepository.deleteImages(images);
	}
}
