import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/dto/category.dto';
import { Price } from 'src/dto/price.dto';
import { Subcategory } from 'src/dto/subcategory.dto';
import { FirebaseService } from 'src/services/firebase.service';
import { flatten } from 'src/utils/util';
import { User } from '../../dto/user.dto';
import { NOTIFICATION } from '../../enums/notification.enum';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectModel('Notification') private notificationDb: Model<any>,
    @InjectModel('User') private usersDb: Model<User>,
  ) {}

  async testAWS(): Promise<any> {
    const usersJUN = await this.usersDb
      .find(
        {
          $expr: {
            $and: [
              { $eq: ['$status', true] },
              { $eq: ['$reciveNotifications', true] },
            ],
          },
        },
        { notificationTokens: 1 },
      )
      .lean();

    const notificationsArray = [];

    for (const user of usersJUN) {
      notificationsArray.push({
        user: user._id,
        title: 'Producto Actualizado',
        body: `El PRoducto Tal ha sido Actualizado`,
        identifier: user._id,
        notificationTokens: user.notificationTokens,
      });
    }

    const pushNotifications = notificationsArray.map((item) => {
      const { title, body, user } = item;
      return item.notificationTokens.map((token: string) => ({
        notification: {
          title,
          body,
          sound: 'default',
        },

        token,
        user,
      }));
    });

    console.log(flatten(pushNotifications));

    for (const batch of flatten(pushNotifications)) {
      console.log('batch', batch);

      /* AWSService.topicARN(
        'dnWoy_m_QwO4RynUsRMTqC:APA91bEZIEVb65UhhMYk6OauBJMw_v9MDUPAdovxZ8_gYS6UdgUGaDQTvB5vuXTaDAzkpsSoO-rLwL2bYg4UY-4F-sxUnFUlGvs8k0AFf_S2-HmVpDEvzNHQ3E0r0gW1txX0Yt9tHqQT',
        {
          title: 'Titulo Not',
          body: 'Body de la not',
        },
      ); */
    }
    /* AWSService.topicARN(
      'dnWoy_m_QwO4RynUsRMTqC:APA91bEZIEVb65UhhMYk6OauBJMw_v9MDUPAdovxZ8_gYS6UdgUGaDQTvB5vuXTaDAzkpsSoO-rLwL2bYg4UY-4F-sxUnFUlGvs8k0AFf_S2-HmVpDEvzNHQ3E0r0gW1txX0Yt9tHqQT',
      {
        title: 'Titulo Not',
        body: 'Body de la not',
      },
    ); */
  }

  async finishSoldOut(document: Category): Promise<any> {
    const usersJUN = await this.usersDb
      .find(
        {
          $expr: {
            $and: [
              { $eq: ['$status', true] },
              { $eq: ['$reciveNotifications', true] },
            ],
          },
        },
        { notificationTokens: 1 },
      )
      .lean();

    const notificationsArray = [];

    for (const user of usersJUN) {
      notificationsArray.push({
        user: user._id,
        title: `${document.name} otra vez disponible `,
        body: `🏃 Añádelo desde ya en tus compras`,
        data: {
          subcategory: document._id.toString(),
          click_action: 'SUBCATEGORY_NOTIFICATION_CLICK',
        },
        identifier: user._id,
        notificationTokens: user.notificationTokens,
      });
    }

    const pushNotifications = notificationsArray.map((item) => {
      const { title, body, data, user } = item;
      return item.notificationTokens.map((token: string) => ({
        notification: {
          title,
          body,
          data,
        },

        token,
        user,
      }));
    });

    for (const batch of flatten(pushNotifications)) {
      console.log('batch', batch);
      /* FirebaseService.sendPushNotifications(pushNotifications); */
      /*  AWSService.topicARN(batch.token, batch.notification); */
    }
  }

  async newOrder(
    type: NOTIFICATION,
    order: string,
    userId: string,
  ): Promise<any> {
    try {
      const usersJUN = await this.usersDb
        .find({ role: 'JUN' }, { notificationTokens: 1 })
        .lean();
      const userOrder = await this.usersDb
        .findOne({ _id: userId }, { notificationTokens: 1 })
        .lean();
      const notificationsArray = [];
      const notificationsArrayUser = [];

      for (const user of usersJUN) {
        notificationsArray.push({
          user: user._id,
          title: 'Nueva Orden',
          body: `Nueva orden de ${user.phone} $`,
          type,
          identifier: order,
          notificationTokens: user.notificationTokens,
        });
      }

      notificationsArrayUser.push({
        user: userOrder._id,
        title: 'Orden Confirmada',
        body: `Tu compra estará siendo procesada de inmediato`,
        type,
        identifier: order,
        notificationTokens: userOrder.notificationTokens,
      });

      const pushNotifications = notificationsArray.map((item) => {
        const { title, email, user, body } = item;
        return item.notificationTokens.map((token: string) => ({
          notification: {
            title,
            body,
          },

          token,
        }));
      });
      const pushNotificationsUser = notificationsArrayUser.map((item) => {
        const { title, email, user, body } = item;
        return item.notificationTokens.map((token: string) => ({
          notification: {
            title,
            body,
          },

          token,
        }));
      });
      if (userOrder) {
        FirebaseService.sendPushNotifications(flatten(pushNotificationsUser));
      }
      if (usersJUN.length !== 0) {
        FirebaseService.sendPushNotifications(flatten(pushNotifications));
      }

      /*

      if (usersJUN.length === 0) return;

      const notificationsArray = [];

      for (const user of usersJUN) {
        notificationsArray.push({
          user: user._id,
          title: 'Nueva Orden',
          body: `Nueva orden de ${user.phone} $`,
          type,
          identifier: orderDB._id,
          notificationTokens: user.notificationTokens,
        });
      } */

      /*  const pushNotifications = notificationsArray.map((item) => {
        const { title, email, user, body } = item;
        return item.notificationTokens.map((token: string) => ({
          notification: {
            title,
            body,
          },

          token,
        }));
      }); */
      /*  for (const batch of flatten(pushNotifications)) {
        console.log('batch', batch); */
      /*  AWSService.topicARN(batch.token, batch.notification); */
      /* } */
    } catch (e) {
      throw new InternalServerErrorException(
        'create notification Database error',
        e,
      );
    }
  }

  async allUsers(type: NOTIFICATION): Promise<any> {
    try {
      const allUsers = await this.usersDb
        .find({}, { notificationTokens: 1 })
        .lean();

      const notificationsArray = [];

      for (const user of allUsers) {
        notificationsArray.push({
          user: user._id,
          title: 'Notificación Prueba',
          body: `Esta es un notificación creada para revisar que esten llegagando las notificaciones a los dispositivos`,
          type,
          identifier: user._id,
          notificationTokens: user.notificationTokens,
        });
      }

      const pushNotifications = notificationsArray.map((item) => {
        const { title, email, user, body } = item;
        return item.notificationTokens.map((token: string) => ({
          notification: {
            title,
            body,
          },
          token,
        }));
      });

      if (allUsers.length !== 0) {
        FirebaseService.sendPushNotifications(flatten(pushNotifications));
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'create notification Database error',
        e,
      );
    }
  }

  async updateEnvio(precios: Price): Promise<any> {
    const usersJUN = await this.usersDb
      .find(
        {
          $expr: {
            $and: [
              { $eq: ['$status', true] },
              { $eq: ['$reciveNotifications', true] },
            ],
          },
        },
        { notificationTokens: 1 },
      )
      .lean();

    const notificationsArray = [];
    for (const user of usersJUN) {
      notificationsArray.push({
        user: user._id,
        title: 'Nuevos precios de envío 🛫',
        body: `Envía tus compras desde $`,
        data: {
          click_action: 'UPDATE_ENVIO_NOTIFICATION_CLICK',
        },
        identifier: user._id,
        notificationTokens: user.notificationTokens,
      });
    }

    const pushNotifications = notificationsArray.map((item) => {
      const { title, body, user, data } = item;
      return item.notificationTokens.map((token: string) => ({
        notification: {
          title,
          body,
          data,
        },

        token,
        user,
      }));
    });

    console.log(flatten(pushNotifications));

    for (const batch of flatten(pushNotifications)) {
      /* AWSService.topicARN(batch.token, batch.notification); */
    }
  }

  async createdProduct(subcategory: Subcategory): Promise<any> {
    const usersJUN = await this.usersDb
      .find(
        {
          $expr: {
            $and: [
              { $eq: ['$status', true] },
              { $eq: ['$reciveNotifications', true] },
            ],
          },
        },
        { notificationTokens: 1 },
      )
      .lean();

    const notificationsArray = [];

    for (const user of usersJUN) {
      notificationsArray.push({
        user: user._id,
        title: 'Para ti 💙',
        body: `${subcategory.name} disponible en la tienda 🛒`,
        identifier: user._id,
        data: {
          subcategory: subcategory._id.toString(),
          click_action: 'SUBCATEGORY_NOTIFICATION_CLICK',
        },
        notificationTokens: user.notificationTokens,
      });
    }

    const pushNotifications = notificationsArray.map((item) => {
      const { title, body, user, data } = item;
      return item.notificationTokens.map((token: string) => ({
        notification: {
          title,
          body,
          data,
        },
        token,
        user,
      }));
    });

    console.log(flatten(pushNotifications));

    for (const batch of flatten(pushNotifications)) {
      console.log('batch', batch);
      /*  AWSService.topicARN(batch.token, batch.notification); */

      /* AWSService.topicARN(
        'dnWoy_m_QwO4RynUsRMTqC:APA91bEZIEVb65UhhMYk6OauBJMw_v9MDUPAdovxZ8_gYS6UdgUGaDQTvB5vuXTaDAzkpsSoO-rLwL2bYg4UY-4F-sxUnFUlGvs8k0AFf_S2-HmVpDEvzNHQ3E0r0gW1txX0Yt9tHqQT',
        {
          title: 'Titulo Not',
          body: 'Body de la not',
        },
      ); */
    }
    /* AWSService.topicARN(
      'dnWoy_m_QwO4RynUsRMTqC:APA91bEZIEVb65UhhMYk6OauBJMw_v9MDUPAdovxZ8_gYS6UdgUGaDQTvB5vuXTaDAzkpsSoO-rLwL2bYg4UY-4F-sxUnFUlGvs8k0AFf_S2-HmVpDEvzNHQ3E0r0gW1txX0Yt9tHqQT',
      {
        title: 'Titulo Not',
        body: 'Body de la not',
      },
    ); */
  }

  async subcategoryDiscount(document: Subcategory): Promise<any> {
    const usersJUN = await this.usersDb
      .find(
        {
          $expr: {
            $and: [
              { $eq: ['$status', true] },
              { $eq: ['$reciveNotifications', true] },
            ],
          },
        },
        { notificationTokens: 1 },
      )
      .lean();

    const notificationsArray = [];
    /*   const discount =
    priceGaloreDiscount && priceGaloreDiscount !== 0
      ? (100 * (priceGalore - priceGaloreDiscount)) / priceGalore
      : (100 * (price - priceDiscount)) / price;
 */

    const discount =
      document.priceGaloreDiscount && document.priceGaloreDiscount !== 0
        ? (100 * (document.priceGalore - document.priceGaloreDiscount)) /
          document.priceGalore
        : (100 * (document.price - document.priceDiscount)) / document.price;

    for (const user of usersJUN) {
      notificationsArray.push({
        user: user._id,
        title: `${document.name} en Rebaja!! `,
        body: ` ☝ Cómpralo con ${discount.toFixed(0)}% de descuento`,
        data: {
          subcategory: document._id.toString(),
          click_action: 'SUBCATEGORY_NOTIFICATION_CLICK',
        },
        identifier: user._id,
        notificationTokens: user.notificationTokens,
      });
    }

    const pushNotifications = notificationsArray.map((item) => {
      const { title, body, data, user } = item;
      return item.notificationTokens.map((token: string) => ({
        notification: {
          title,
          body,
          data,
        },

        token,
        user,
      }));
    });

    for (const batch of flatten(pushNotifications)) {
      console.log('batch', batch);
      /*  AWSService.topicARN(batch.token, batch.notification); */
    }
  }
}
