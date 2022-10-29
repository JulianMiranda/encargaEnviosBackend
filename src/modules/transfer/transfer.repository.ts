import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transfer } from '../../dto/transfer.dto';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe/constants';
import { User } from 'src/dto/user.dto';

@Injectable()
export class TransferRepository {
  readonly type = ENTITY.TRANSFER;

  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    @InjectModel('Transfer') private transferDb: Model<Transfer>,
  ) {}
  async transfer(data: Partial<Transfer>, user: User): Promise<any> {
    try {
      const { totalPayment, currency, changeValue, idPayment } = data;
      console.log('data', data);
      console.log('user', user);
      const body = {
        amount: totalPayment * 100,
        currency: 'usd',
        source: idPayment,
        description: user.name + '-' + user.id.toString(),
      };
      const payment = await this.stripe.charges.create(body);

      const newTransfer = new this.transferDb({
        totalPayment,
        currency,
        changeValue,
        idPayment: payment.id,
        user: user.id,
      });
      const document = await newTransfer.save();

      /*  const result = await this.stripe.customers.list(); */

      return !!payment;
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter payments Database error',
        e,
      );
    }
  }

  async paymentMethod(data: Partial<Transfer>, user: User): Promise<any> {
    try {
      const {
        totalPayment,
        currency,
        cubaCurrency,
        changeValue,
        idPayment,
        idPaymentIntent,
      } = data;

      try {
        let intent: Stripe.Response<Stripe.PaymentIntent>;
        if (idPayment) {
          // Create the PaymentIntent
          intent = await this.stripe.paymentIntents.create({
            payment_method: idPayment,
            amount: totalPayment * 100,
            currency: currency,
            confirmation_method: 'manual',
            confirm: true,
          });
        } else if (idPaymentIntent) {
          intent = await this.stripe.paymentIntents.confirm(idPaymentIntent);
        }
        // Send the response to the client
        return this.generateResponse(intent);
      } catch (e) {
        // Display error on client
        return { error: e.message };
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter payments Database error',
        e,
      );
    }
  }
  async generateResponse(
    intent: Stripe.Response<Stripe.PaymentIntent>,
  ): Promise<any> {
    // Note that if your API version is before 2019-02-11, 'requires_action'
    // appears as 'requires_source_action'.
    if (
      intent.status === 'requires_action' &&
      intent.next_action.type === 'use_stripe_sdk'
    ) {
      // Tell the client to handle the action
      return {
        requires_action: true,
        payment_intent_client_secret: intent.client_secret,
      };
    } else if (intent.status === 'succeeded') {
      // The payment didn’t need any additional actions and completed!
      // Handle post-payment fulfillment
      return {
        success: true,
      };
    } else {
      // Invalid status
      return {
        error: 'Invalid PaymentIntent status',
      };
    }
  }

  async getList(query: MongoQuery): Promise<any> {
    try {
      const { filter, projection, sort, limit, skip, page, population } = query;
      const [count, transfers] = await Promise.all([
        this.transferDb.countDocuments(filter),
        this.transferDb
          .find(filter, projection)
          .sort(sort)
          .limit(limit)
          .skip(skip)
          .populate(population),
      ]);
      const totalPages = limit !== 0 ? Math.floor(count / limit) : 1;
      return { count, page, totalPages, data: transfers };
    } catch (e) {
      throw new InternalServerErrorException(
        'Filter transfers Database error',
        e,
      );
    }
  }

  async getOne(id: string): Promise<Transfer> {
    try {
      const document = await this.transferDb.findOne({ _id: id });

      if (!document)
        throw new NotFoundException(`Could not find transfer for id: ${id}`);

      return document;
    } catch (e) {
      if (e.status === 404) throw e;
      else
        throw new InternalServerErrorException(
          'findTransfer Database error',
          e,
        );
    }
  }

  async create(data: Transfer): Promise<boolean> {
    try {
      const newTransfer = new this.transferDb(data);
      const document = await newTransfer.save();

      return !!(await this.transferDb.findOneAndUpdate({ _id: document._id }));
    } catch (e) {
      throw new InternalServerErrorException(
        'createTransfer Database error',
        e,
      );
    }
  }

  async update(id: string, data: Partial<Transfer>): Promise<boolean> {
    try {
      const document = await this.transferDb.findOneAndUpdate(
        { _id: id },
        { ...data },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find transfer to update for id: ${id}`,
        );

      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'updateTransfer Database error',
        e,
      );
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const document = await this.transferDb.findOneAndUpdate(
        { _id: id },
        { status: false },
      );

      if (!document)
        throw new NotFoundException(
          `Could not find transfer to delete for id: ${id}`,
        );
      return !!document;
    } catch (e) {
      if (e.status === 404) throw e;
      throw new InternalServerErrorException(
        'deleteTransfer Database error',
        e,
      );
    }
  }
}
