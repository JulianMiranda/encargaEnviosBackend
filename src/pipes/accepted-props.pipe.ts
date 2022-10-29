import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {acceptedProps} from '../utils';

@Injectable()
export class AcceptedProps implements PipeTransform<any> {
	route: string;

	constructor(route: string) {
		this.route = route;
	}
	async transform(value: any, metadata: ArgumentMetadata) {
		return typeof value === 'object' ? acceptedProps(this.route, value) : value;
	}
}
