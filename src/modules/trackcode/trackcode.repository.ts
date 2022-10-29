import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trackcode } from '../../dto/trackcode.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { STATETRACKCODE } from '../../enums/statetrackcode.enum';

@Injectable()
export class TrackcodeRepository {
  readonly type = ENTITY.TRACKCODE;

  constructor(
    @InjectModel('Trackcode') private trackcodeDb: Model<Trackcode>,
  ) {}

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      console.log('filter', filter);
      console.log('projection', projection);
      const [count, categories] = await Promise.all([
        this.trackcodeDb.countDocuments(filter),
        this.trackcodeDb
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

  async getOne(id: string): Promise<Trackcode> {
    try {
      const document = await this.trackcodeDb.findOne({ _id: id }).populate([
        {
          path: 'user',
          match: { status: true },
          select: { name: true },
        },
        {
          path: 'order',
          select: { cost: true },
        },
        /* {
          path: 'subcategories',
          select: { name: true },
        }, */
      ]);

      if (!document)
        throw new NotFoundException(`Could not find trackcode for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException(
          'findTrackcode Database error',
          e,
        );
    }
  }

  async create(data: Trackcode): Promise<boolean> {
    try {
      const newTrackcode = new this.trackcodeDb(data);
      const document = await newTrackcode.save();

      return !!document;
    } catch (e) {
      throw new InternalServerErrorException(
        'createTrackcode Database error',
        e,
      );
    }
  }

  async update(id: string, data: Partial<Trackcode>): Promise<boolean> {
    try {
      const document = await this.trackcodeDb.findOneAndUpdate(
        { _id: id },
        { ...data },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find trackcode to update for id: ${id}`,
        );

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'updateTrackcode Database error',
        e,
      );
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.trackcodeDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find trackcode to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'deleteTrackcode Database error',
        e,
      );
    }
  }

  async checkCodesStatus(): Promise<any> {
    try {
      const onedays = new Date();
      const twodays = new Date();
      const threedays = new Date();
      const fourdays = new Date();
      const fivedays = new Date();
      const sixdays = new Date();
      const sevendays = new Date();
      const ninedays = new Date();
      const tendays = new Date();
      onedays.setDate(onedays.getDate() - 1);
      twodays.setDate(twodays.getDate() - 2);
      threedays.setDate(threedays.getDate() - 3);
      fourdays.setDate(fourdays.getDate() - 4);
      fivedays.setDate(fivedays.getDate() - 5);
      sixdays.setDate(sixdays.getDate() - 6);
      sevendays.setDate(sevendays.getDate() - 7);
      ninedays.setDate(ninedays.getDate() - 9);
      tendays.setDate(tendays.getDate() - 10);

      const [agency, aims, aduecu, copair, aduanacub] = await Promise.all([
        this.trackcodeDb.find({
          $expr: {
            $and: [
              { $lt: ['$createdAt', new Date()] },
              { $gt: ['$createdAt', twodays] },
            ],
          },
        }),
        this.trackcodeDb.find({
          $expr: {
            $and: [
              { $lt: ['$createdAt', threedays] },
              { $gt: ['$createdAt', fourdays] },
            ],
          },
        }),
        this.trackcodeDb.find({
          $expr: {
            $and: [
              { $lt: ['$createdAt', fourdays] },
              { $gt: ['$createdAt', fivedays] },
            ],
          },
        }),
        this.trackcodeDb.find({
          $expr: {
            $and: [
              { $lt: ['$createdAt', sixdays] },
              { $gt: ['$createdAt', sevendays] },
            ],
          },
        }),
        this.trackcodeDb.find({
          $expr: {
            $and: [
              { $lt: ['$createdAt', ninedays] },
              { $gt: ['$createdAt', tendays] },
            ],
          },
        }),
      ]);

      agency.map(async (trackcode) => {
        await this.trackcodeDb.findOneAndUpdate(
          { _id: trackcode._id },
          { state: STATETRACKCODE.AGENCY },
        );
      });
      aims.map(async (trackcode) => {
        await this.trackcodeDb.findOneAndUpdate(
          { _id: trackcode._id },
          { state: STATETRACKCODE.AIMS },
        );
      });
      aduecu.map(async (trackcode) => {
        await this.trackcodeDb.findOneAndUpdate(
          { _id: trackcode._id },
          { state: STATETRACKCODE.ADUECU },
        );
      });
      copair.map(async (trackcode) => {
        await this.trackcodeDb.findOneAndUpdate(
          { _id: trackcode._id },
          { state: STATETRACKCODE.COPAAIR },
        );
      });
      aduanacub.map(async (trackcode) => {
        await this.trackcodeDb.findOneAndUpdate(
          { _id: trackcode._id },
          { state: STATETRACKCODE.ADUANACUB },
        );
      });
      return { agency, aims, aduecu, copair, aduanacub };
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'deleteTrackcode Database error',
        e,
      );
    }
  }
}
