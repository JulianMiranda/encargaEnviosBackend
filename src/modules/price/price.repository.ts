import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Price } from '../../dto/price.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';

@Injectable()
export class PriceRepository {
  readonly type = ENTITY.PRICE;

  constructor(@InjectModel('Price') private priceDb: Model<Price>) {}

  async getPrices(): Promise<any> {
    try {
      const prices = await this.priceDb.find();

      return { prices: prices[0] };
    } catch (e) {
      throw new InternalServerErrorException('Filter prices Database error', e);
    }
  }

  async update(data: Partial<Price>): Promise<boolean> {
    try {
      const document = await this.priceDb.find();
      await this.priceDb.findOneAndUpdate(
        { _id: document[0]._id },
        { ...data },
      );

      if (!document)
        throw new NotFoundException(`Could not find price to update`);

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException('updatePrice Database error', e);
    }
  }
}
