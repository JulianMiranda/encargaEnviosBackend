import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Order } from 'src/dto/order.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { AcceptedProps } from '../../pipes/accepted-props.pipe';
import { RequiredProps } from '../../pipes/required-props.pipe';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { OrderRepository } from './order.repository';

@Controller(ENTITY.ORDER)
export class OrderController {
  constructor(private orderRepository: OrderRepository) {}
  @UseGuards(AuthenticationGuard)
  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.orderRepository.getList(query);
  }
  @UseGuards(AuthenticationGuard)
  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<Order> {
    return this.orderRepository.getOne(id);
  }
  @UseGuards(AuthenticationGuard)
  @Post('/setOrder')
  @UsePipes(new RequiredProps(ENTITY.ORDER))
  setOrder(@Body() data: Order, @Req() req: any): Promise<boolean> {
    return this.orderRepository.setOrder(data, req.user.id);
  }
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  @UsePipes(new RequiredProps(ENTITY.ORDER))
  create(@Body() data: Order): Promise<boolean> {
    return this.orderRepository.create(data);
  }
  @UseGuards(AuthenticationGuard)
  @Put('/update/:id')
  @UsePipes(new AcceptedProps(ENTITY.ORDER))
  update(
    @Param('id') id: string,
    @Body() data: Partial<Order>,
  ): Promise<boolean> {
    return this.orderRepository.update(id, data);
  }
  @UseGuards(AuthenticationGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.orderRepository.delete(id);
  }

  @Get('/getPrice')
  getPrice(): number {
    return this.orderRepository.getPrice();
  }

  @Get('/getMN')
  getMN(): number {
    return this.orderRepository.getMN();
  }

  @Get('/getMLC')
  getMLC(): number {
    return this.orderRepository.getMLC();
  }
  @Get('/trackCodes/:id')
  trackCodes(@Param('id') id: string): Promise<any> {
    return this.orderRepository.trackCodes(id);
  }

  @Post('/newSendMoney')
  newSendMoney(@Body() data: any): Promise<any> {
    return this.orderRepository.newSendMoney(data);
  }
}
