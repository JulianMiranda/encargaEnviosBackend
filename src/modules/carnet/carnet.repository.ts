import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Carnet } from '../../dto/carnet.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';

@Injectable()
export class CarnetRepository {
  readonly type = ENTITY.CARNET;

  constructor(@InjectModel('Carnet') private carnetDb: Model<Carnet>) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, carnets] = await Promise.all([
        this.carnetDb.countDocuments(filter),
        this.carnetDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: carnets };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter carnets Database error',
        e,
      );
    }
  }

  async getListUnAuth(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, carnets] = await Promise.all([
        this.carnetDb.countDocuments(filter),
        this.carnetDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: carnets };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter carnets Database error',
        e,
      );
    }
  }

  async getOne(id: string): Promise<Carnet> {
    try {
      const document = await this.carnetDb.findOne({ _id: id }).populate([
        {
          path: 'user',
          match: { status: true },
          select: { name: true, phone: true },
        },
      ]);

      if (!document)
        throw new NotFoundException(`Could not find carnet for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException('findCarnet Database error', e);
    }
  }

  async create(data: Carnet): Promise<boolean> {
    try {
      const newCarnet = new this.carnetDb(data);
      const document = await newCarnet.save();

      return !!document;
    } catch (e) {
      throw new InternalServerErrorException('createCarnet Database error', e);
    }
  }

  async update(id: string, data: Partial<Carnet>): Promise<boolean> {
    try {
      const document = await this.carnetDb.findOneAndUpdate(
        { _id: id },
        { ...data },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find carnet to update for id: ${id}`,
        );

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('updateCarnet Database error', e);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.carnetDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find carnet to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('deleteCarnet Database error', e);
    }
  }
}
