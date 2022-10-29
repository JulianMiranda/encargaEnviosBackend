import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/dto/user.dto';
import { FirebaseService } from 'src/services/firebase.service';
import { ENTITY } from '../../enums/entity.enum';
import { ImageRepository } from '../image/image.repository';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel('User') private userDb: Model<User>,
    private imageRepository: ImageRepository,
  ) {}

  readonly type = ENTITY.USERS;

  async login(user: User): Promise<User> {
    try {
      if (user.id) {
        console.log(`Se ha logueado el usuario: ${user.id}`);
        return this.userDb
          .findById(user.id, {
            name: true,
            email: true,
            role: true,
            image: true,
            theme: true,
            phone: true,
            reciveNotifications: true,
            notificationTokens: true,
          })
          .populate([
            {
              path: 'image',
              match: { status: true },
              select: { url: true },
            },
          ]);
      }
      return await this.RegisterUser(user);
    } catch (e) {
      throw new InternalServerErrorException('Login Database error', e);
    }
  }

  async RegisterUser(user: User): Promise<User> {
    try {
      const { image, ...rest } = user;
      const registeredUser = await new this.userDb(rest).save();

      const claims = { role: user.role, mongoId: registeredUser.id };
      FirebaseService.setClaims(user.firebaseId, claims);

      const setImage = {
        url: image,
        parentType: this.type,
        parentId: registeredUser.id,
      };
      const imageModel = await this.imageRepository.insertImages([setImage]);

      return await this.userDb
        .findOneAndUpdate(
          { _id: registeredUser.id },
          { image: imageModel[0]._id },
          { new: true },
        )
        .select({
          name: true,
          email: true,
          image: true,
          role: true,
          theme: true,
          phone: true,
          reciveNotifications: true,
          notificationTokens: true,
        })
        .populate([
          {
            path: 'image',
            match: { status: true },
            select: { url: true },
          },
        ]);
    } catch (e) {
      throw new InternalServerErrorException(
        'Register Mongo Database error',
        e,
      );
    }
  }
}
