import {Injectable} from '@nestjs/common';
import {ROLES} from '../enums/roles.enum';
import {AuthorizationGuard} from './authorization.guard';

@Injectable()
export class CunGuard extends AuthorizationGuard {
	constructor() {
		super([ROLES.ADMIN, ROLES.JUN, ROLES.CUN]);
	}
}
