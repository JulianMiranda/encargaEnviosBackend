import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {User} from 'src/dto/user.dto';
import {AuthenticationGuard} from '../../guards/authentication.guard';
import {AuthRepository} from './auth.repository';

@Controller()
@UseGuards(AuthenticationGuard)
export class AuthController {
	constructor(private _authRepo: AuthRepository) {}

	@Get('/login')
	async login(@Req() req): Promise<User> {
		return this._authRepo.login({...req.user});
	}
}
