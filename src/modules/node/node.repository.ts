import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Node } from '../../dto/node.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';

@Injectable()
export class NodeRepository {
  readonly type = ENTITY.NODE;

  constructor(@InjectModel('Node') private nodeDb: Model<Node>) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, categories] = await Promise.all([
        this.nodeDb.countDocuments(filter),
        this.nodeDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: categories };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter categories Database error',
        e,
      );
    }
  }

  async getOne(id: string): Promise<Node> {
    try {
      const document = await this.nodeDb.findOne({ _id: id });

      if (!document)
        throw new NotFoundException(`Could not find node for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else throw new InternalServerErrorException('findNode Database error', e);
    }
  }

  async create(data: Node): Promise<boolean> {
    try {
      const newNode = new this.nodeDb(data);
      const document = await newNode.save();

      return !!document;
    } catch (e) {
      throw new InternalServerErrorException('createNode Database error', e);
    }
  }

  async update(id: string, data: Partial<Node>): Promise<boolean> {
    try {
      const document = await this.nodeDb.findOneAndUpdate(
        { _id: id },
        { ...data },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find node to update for id: ${id}`,
        );

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('updateNode Database error', e);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.nodeDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find node to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('deleteNode Database error', e);
    }
  }
}
