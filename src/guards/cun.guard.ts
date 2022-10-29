import {Injectable} from '@nestjs/common';
import {ROLES} from '../enums/roles.enum';
import {AuthorizationGuard} from './authorization.guard';

@Injectable()
export class JunGuard extends AuthorizationGuard {
	constructor() {
		super([ROLES.ADMIN, ROLES.JUN]);
	}
}
