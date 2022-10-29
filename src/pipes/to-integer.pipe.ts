import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform,
} from '@nestjs/common';

export class ToIntegerPipe implements PipeTransform<string> {
	transform(value: string, metadata: ArgumentMetadata): number {
		const val = parseInt(value, 10);

		if (isNaN(val)) {
			throw new BadRequestException(`Conversion to number failed ${value}`);
		}

		return val;
	}
}
