import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/dto/user.dto';
import { Message } from '../../dto/message.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { findUser } from './findUser.aggregation';

@Injectable()
export class MessageRepository {
  readonly type = ENTITY.MESSAGES;

  constructor(
    @InjectModel('Message') private messageDb: Model<Message>,
    @InjectModel('User') private userDb: Model<User>,
  ) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, messages] = await Promise.all([
        this.messageDb.countDocuments(filter),
        this.messageDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: messages };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter messages Database error',
        e,
      );
    }
  }

  async getMessages(id: string): Promise<any> {
    try {
      const [count, messages] = await Promise.all([
        this.messageDb.countDocuments(),
        this.messageDb
          .find({
            $or: [{ para: id }, { de: id }],
          })
          .sort({ createdAt: -1 }),
      ]);

      return { count, data: messages };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter messages Database error',
        e,
      );
    }
  }

  async getAdminMessages(admin: string, id: string): Promise<any> {
    try {
      const [count, messages] = await Promise.all([
        this.messageDb.countDocuments(),
        this.messageDb
          .find({
            $or: [{ para: id }, { de: id }],
          })
          .sort({ createdAt: 1 }),
      ]);

      return { count, data: messages };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter messages Database error',
        e,
      );
    }
  }

  async getUsersMessages(id: string): Promise<any> {
    try {
      const users = await this.messageDb.aggregate(findUser());

      return users;

      /* const [count, messages] = await Promise.all([
        this.messageDb.countDocuments(),
        this.messageDb
          .find({
            $or: [{ para: id }, { de: id }],
          })
          .sort({ createdAt: -1 }),
      ]);

      return { count, data: messages }; */
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter messages Database error',
        e,
      );
    }
  }

  async setMessages(payload: Partial<Message>): Promise<any> {
    try {
      const mensaje = await new this.messageDb(payload).save();
      return mensaje;
    } catch (e) {
      throw new InternalServerErrorException(
        'filter grabarMensaje Database error',
        e,
      );
    }
  }

  async getOne(id: string): Promise<Message> {
    try {
      const document = await this.messageDb.findOne({ _id: id }).populate([
        {
          path: 'image',
          match: { status: true },
          select: { url: true },
        },
      ]);

      if (!document)
        throw new NotFoundException(`Could not find message for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException('findMessage Database error', e);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.messageDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find message to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('deleteMessage Database error', e);
    }
  }
}
