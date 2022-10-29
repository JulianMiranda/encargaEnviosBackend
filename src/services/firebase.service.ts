import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { splitArray } from 'src/utils/util';
/* import {splitArray} from '../utils/util'; */

@Injectable()
export class FirebaseService {
  private static readonly logger = new Logger(FirebaseService.name);
  static init() {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  static get getAdmin(): any {
    return admin;
  }

  static setClaims(id: string, claims: object) {
    admin
      .auth()
      .setCustomUserClaims(id, { ...claims })
      .then(() => console.log('Successful firebase claims update'))
      .catch((e) => {
        throw new InternalServerErrorException(
          'Error in firebase claims update',
          e,
        );
      });
  }
  static setName(id: string) {
    admin
      .auth()
      .updateUser(id, { displayName: 'Admin' })
      .then(() => console.log('Successful firebase claims update'))
      .catch((e) => {
        throw new InternalServerErrorException(
          'Error in firebase claims update',
          e,
        );
      });
  }
  static deleteUser(id: string) {
    admin.auth().deleteUser(id);
    this.logger.log(`Delete from Firebase user ${id}`);
  }

  static async sendPushNotifications(notificationsArray: any[]) {
    const notificationBatches = splitArray(notificationsArray, 500);

    for (const batch of notificationBatches) {
      await admin.messaging().sendAll(batch);
    }

    this.logger.log(
      `${notificationsArray.length} push notifications have been sent`,
    );
  }
}
