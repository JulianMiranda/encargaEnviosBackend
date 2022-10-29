import {Module} from '@nestjs/common';
import {RoleController} from './role.controller';
import {RoleRepository} from './role.repository';

@Module({
	controllers: [RoleController],
	providers: [RoleRepository],
	exports: [RoleRepository],
})
export class RoleModule {}
