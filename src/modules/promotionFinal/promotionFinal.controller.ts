import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { PromotionFinal } from 'src/dto/promotionFinal.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { AcceptedProps } from '../../pipes/accepted-props.pipe';
import { RequiredProps } from '../../pipes/required-props.pipe';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { PromotionFinalRepository } from './promotionFinal.repository';

@Controller(ENTITY.PROMOTIONFINAL)
export class PromotionFinalController {
  constructor(private promotionFinalRepository: PromotionFinalRepository) {}

  @Post('/getListUnAuth')
  @UsePipes(new TransformQuery())
  getListUnAuth(@Body() query: MongoQuery): any {
    return this.promotionFinalRepository.getList(query);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.promotionFinalRepository.getList(query);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<PromotionFinal> {
    return this.promotionFinalRepository.getOne(id);
  }
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  @UsePipes(new RequiredProps(ENTITY.PROMOTIONFINAL))
  create(@Body() data: PromotionFinal): Promise<boolean> {
    const { image } = data;
    delete data.image;
    return this.promotionFinalRepository.create(data, image);
  }

  @UseGuards(AuthenticationGuard)
  @Put('/update/:id')
  @UsePipes(new AcceptedProps(ENTITY.PROMOTIONFINAL))
  update(
    @Param('id') id: string,
    @Body() data: Partial<PromotionFinal>,
  ): Promise<boolean> {
    const { image } = data;
    delete data.image;
    return this.promotionFinalRepository.update(id, data, image);
  }
  @UseGuards(AuthenticationGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.promotionFinalRepository.delete(id);
  }
}
