import {Controller, Get, UseGuards} from '@nestjs/common';
import {AuthenticationGuard} from 'src/guards/authentication.guard';
import {RoleRepository} from './role.repository';

@Controller()
@UseGuards(AuthenticationGuard)
export class RoleController {
	constructor(private roleRepository: RoleRepository) {}

	@Get('/getRoles')
	getRoles(): Promise<any> {
		return this.roleRepository.getRoles();
	}
}
