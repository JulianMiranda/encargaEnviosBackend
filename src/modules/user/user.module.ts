import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema} from '../../schemas/user.schema';
import {ImageModule} from '../image/image.module';
import {UserController} from './user.controller';
import {UserRepository} from './user.repository';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'User',
				schema: UserSchema,
			},
		]),
		ImageModule,
	],
	controllers: [UserController],
	providers: [UserRepository],
})
export class UserModule {}
