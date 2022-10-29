import {
  Injectable,
  NestMiddleware,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from 'src/services/firebase.service';
import * as AWS from '@aws-sdk/client-sns';
import { User } from '../dto/user.dto';
import { ROLES } from '../enums/roles.enum';
import { RoleRepository } from '../modules/role/role.repository';
import { getDefaultImage } from '../utils/index';

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
  constructor(private roleRepository: RoleRepository) {}

  async use(req: Request, res: Response, next: () => void) {
    const token = req.headers['x-token'];
    /*     const client = new AWS.SNS({ region: 'us-east-1' });
    const topic = await client.createTopic({
      Name: 'arn:aws:sns:us-east-1:174491001014:app/GCM/NotificationFirebase',
    });

    topic.publish({
      message: 'Hello!',
    }); */

    if (!token) {
      next();
      return;
    }
    try {
      const firebaseInfo = await FirebaseService.getAdmin
        .auth()
        .verifyIdToken(token);

      if (firebaseInfo) {
        if (!firebaseInfo.name)
          throw new ServiceUnavailableException('Please login again');

        const user: Partial<User> = {
          firebaseId: firebaseInfo.sub,
          name: firebaseInfo.name,
          image: firebaseInfo.picture
            ? firebaseInfo.picture
            : getDefaultImage(firebaseInfo.name),
          role: firebaseInfo.role || ROLES.CUN,
        };
        if (firebaseInfo.email) user.email = firebaseInfo.email;
        if (firebaseInfo.phone_number) user.phone = firebaseInfo.phone_number;
        if (firebaseInfo.mongoId) user.id = firebaseInfo.mongoId;

        (user.permissions = this.roleRepository.getRoles()[user.role]),
          (req['user'] = user);
      }
    } catch (e) {
      if (e.status === 503) throw e;
      else throw new UnauthorizedException('Authentication error', e);
    }

    next();
  }
}
