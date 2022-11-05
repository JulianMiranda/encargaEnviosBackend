import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyShop } from 'src/dto/my-shop.dto';
import { Order } from 'src/dto/order.dto';
import { NOTIFICATION } from 'src/enums/notification.enum';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { NotificationsRepository } from '../notifications/notifications.repository';
import { SendGridService } from '../../services/sendgrid.service';
import { User } from '../../dto/user.dto';
import { Trackcode } from '../../dto/trackcode.dto';

@Injectable()
export class OrderRepository {
  readonly type = ENTITY.ORDER;

  constructor(
    @InjectModel('Order') private orderDb: Model<Order>,
    @InjectModel('MyShop') private shopDb: Model<MyShop>,
    @InjectModel('User') private userDb: Model<User>,
    @InjectModel('Trackcode') private trackcodeDb: Model<Trackcode>,
    private notificationsRepository: NotificationsRepository,
  ) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, order] = await Promise.all([
        this.orderDb.countDocuments(filter),
        this.orderDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: order };
    } catch (e) {
      throw new InternalServerErrorException('Filter order Database error', e);
    }
  }

  async getOne(id: string): Promise<Order> {
    try {
      const document = await this.orderDb.findOne({ _id: id }).populate([
        {
          path: 'user',
          select: { name: true, phone: true },
        },
        {
          path: 'selectedCarnet',
          select: {
            name: true,
            firstLastName: true,
            secondLastName: true,
            carnet: true,
            address: true,
            deparment: true,
            floor: true,
            number: true,
            firstAccross: true,
            secondAccross: true,
            reparto: true,
            municipio: true,
            provincia: true,
            phoneNumber: true,
            status: true,
          },
        },
        {
          path: 'trackcode',
          fields: {
            user: true,
            code: true,
            state: true,
            status: true,
            createdAt: true,
          },
        },
      ]);

      if (!document)
        throw new NotFoundException(`Could not find order for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException('findOrder Database error', e);
    }
  }

  async setOrder(data: Order, userId: string): Promise<any> {
    try {
      const count = await this.orderDb.countDocuments();
      data.order = (count + 1000).toString();
      const newOrder = new this.orderDb(data);
      const document = await newOrder.save();
      if (document) {
        const newTrackcode = new this.trackcodeDb({
          user: data.user,
          order: document._id,
        });
        const documentTrack = await newTrackcode.save();

        await this.orderDb.findOneAndUpdate(
          { _id: document._id },
          { trackcode: documentTrack._id },
        );
        const codes = [];
        data.car.map((carItem) => {
          for (let index = 0; index < carItem.cantidad; index++) {
            console.log(carItem.category);
            codes.push({
              category: carItem.category.id,
              code: '',
              ship: carItem.category.ship,
            });
          }
        });
        await this.orderDb.findOneAndUpdate({ _id: document._id }, { codes });
        const [user, deleteCar] = await Promise.all([
          this.userDb.findById(data.user, { name: true, email: true }),
          this.shopDb.findOneAndUpdate({ user: data.user }, { car: [] }),
        ]);
        await this.notificationsRepository.newOrder(
          NOTIFICATION.ORDER,
          document._id,
          user._id,
        );
        /* SendGridService.sendGrid(document, user).catch((err) =>
          console.log(err),
        ); */
      }
      return document;
    } catch (e) {
      console.log(e.message);
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException('findOrder Database error', e);
    }
  }

  async create(data: Order): Promise<boolean> {
    try {
      const newOrder = new this.orderDb(data);
      const document = await newOrder.save();

      return !!document;
    } catch (e) {
      throw new InternalServerErrorException('createOrder Database error', e);
    }
  }

  async update(id: string, data: Partial<Order>): Promise<boolean> {
    try {
      const document = await this.orderDb.findOneAndUpdate(
        { _id: id },
        { ...data },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find order to update for id: ${id}`,
        );

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('updateOrder Database error', e);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.orderDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find order to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('deleteOrder Database error', e);
    }
  }

  getPrice(): number {
    try {
      return 21.0;
    } catch (e) {
      if (e.status === 404) throw e;
      else throw new InternalServerErrorException('getPrice Database error', e);
    }
  }

  getMN(): number {
    try {
      return 90.0;
    } catch (e) {
      if (e.status === 404) throw e;
      else throw new InternalServerErrorException('getMN Database error', e);
    }
  }

  getMLC(): number {
    try {
      return 130.0;
    } catch (e) {
      if (e.status === 404) throw e;
      else throw new InternalServerErrorException('getMLC Database error', e);
    }
  }
  newSendMoney(data: any): any {
    try {
      SendGridService.sendGridSendMoney(data).catch((err) => console.log(err));
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException(
          'newSendMoney Database error',
          e,
        );
    }
  }
  async trackCodes(id: string): Promise<any> {
    try {
      const user = await this.userDb.findById(id, {
        codes: true,
      });
    } catch (e) {
      if (e.status === 404) throw e;
      else throw new InternalServerErrorException('getPrice Database error', e);
    }
  }
}
