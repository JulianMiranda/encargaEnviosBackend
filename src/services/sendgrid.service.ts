import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as moment from 'moment';
import {
  SENDGRID_API_KEY,
  SENDGRID_TEMPL_ID,
  SENDGRID_TEMPL_ID_MONEY,
} from '../config/config';
import { Order } from '../dto/order.dto';
import { User } from '../dto/user.dto';
@Injectable()
export class SendGridService {
  private static readonly logger = new Logger(SendGridService.name);
  static init() {}

  static async sendGrid(data: Partial<Order>, user: Partial<User>) {
    try {
      const { car } = data;
      const dataCar = car.map((item) => {
        const costItem = item.cantidad * item.category.price;
        return { name: item.category.name, cantidad: item.cantidad, costItem };
      });

      const envio = 19.6;
      let total = 0;

      dataCar.forEach(function (item) {
        total += item.costItem;
      });
      sgMail.setApiKey(SENDGRID_API_KEY);
      const msgToJUN = {
        to: 'jmirandauria@gmail.com',
        /** This is the sender email account */
        from: {
          name: 'Packuba',
          email: 'enviospackuba@gmail.com',
        },
        /** This the TemplateID from SG that is used for sending the e-mail */

        templateId: SENDGRID_TEMPL_ID,

        dynamicTemplateData: {
          user: user.name,
          total,
          envio,
          products: dataCar,
        },
      };

      /** Sends an e-mail to a Mariachi Group when a serenade for a user has been accepted by the system */

      sgMail.send(msgToJUN);
    } catch (error) {}
  }

  static async sendGridSendMoney(data: any) {
    const { name, phone, sender, reciber, currency, countryCode } = data;
    sgMail.setApiKey(SENDGRID_API_KEY);

    const msgToJUN = {
      to: 'jmirandauria@gmail.com',
      /** This is the sender email account */
      from: {
        name: 'Packuba',
        email: 'enviospackuba@gmail.com',
      },
      /** This the TemplateID from SG that is used for sending the e-mail */

      templateId: SENDGRID_TEMPL_ID_MONEY,

      dynamicTemplateData: {
        name,
        phone,
        sender,
        reciber,
        currency,
        countryCode,
      },
    };

    /** Sends an e-mail to a Mariachi Group when a serenade for a user has been accepted by the system */

    sgMail.send(msgToJUN);
  }
}
