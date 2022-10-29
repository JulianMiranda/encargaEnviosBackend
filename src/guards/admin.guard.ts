import {Injectable} from '@nestjs/common';
import {ROLES} from '../enums/roles.enum';
import {AuthorizationGuard} from './authorization.guard';

@Injectable()
export class AdminGuard extends AuthorizationGuard {
	constructor() {
		super([ROLES.ADMIN]);
	}
}
