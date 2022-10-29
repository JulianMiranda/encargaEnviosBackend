import {
  Body,
  Req,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Transfer } from 'src/dto/transfer.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { AcceptedProps } from '../../pipes/accepted-props.pipe';
import { RequiredProps } from '../../pipes/required-props.pipe';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { TransferRepository } from './transfer.repository';

@Controller(ENTITY.TRANSFER)
@UseGuards(AuthenticationGuard)
export class TransferController {
  constructor(private transferRepository: TransferRepository) {}

  @Post('/')
  @UsePipes(new RequiredProps(ENTITY.TRANSFER))
  transfer(@Body() data: Transfer, @Req() req): Promise<boolean> {
    return this.transferRepository.transfer(data, { ...req.user });
  }

  @Post('/paymentMethod')
  @UsePipes(new RequiredProps(ENTITY.TRANSFER))
  paymentMethod(@Body() data: Transfer, @Req() req): Promise<boolean> {
    return this.transferRepository.paymentMethod(data, { ...req.user });
  }

  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.transferRepository.getList(query);
  }

  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<Transfer> {
    return this.transferRepository.getOne(id);
  }

  @Post('/create')
  @UsePipes(new RequiredProps(ENTITY.TRANSFER))
  create(@Body() data: Transfer): Promise<boolean> {
    return this.transferRepository.create(data);
  }

  @Put('/update/:id')
  @UsePipes(new AcceptedProps(ENTITY.TRANSFER))
  update(
    @Param('id') id: string,
    @Body() data: Partial<Transfer>,
  ): Promise<boolean> {
    return this.transferRepository.update(id, data);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.transferRepository.delete(id);
  }
}
