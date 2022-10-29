import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {requiredProps} from '../utils';

@Injectable()
export class RequiredProps implements PipeTransform<any> {
	route: string;

	constructor(route: string) {
		this.route = route;
	}
	async transform(value: any, metadata: ArgumentMetadata) {
		return typeof value === 'object' ? requiredProps(this.route, value) : value;
	}
}
