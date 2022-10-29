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
import { Promotion } from 'src/dto/promotion.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { AcceptedProps } from '../../pipes/accepted-props.pipe';
import { RequiredProps } from '../../pipes/required-props.pipe';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { PromotionRepository } from './promotion.repository';

@Controller(ENTITY.PROMOTION)
export class PromotionController {
  constructor(private promotionRepository: PromotionRepository) {}

  @Post('/getListUnAuth')
  @UsePipes(new TransformQuery())
  getListUnAuth(@Body() query: MongoQuery): any {
    return this.promotionRepository.getList(query);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.promotionRepository.getList(query);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<Promotion> {
    return this.promotionRepository.getOne(id);
  }
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  @UsePipes(new RequiredProps(ENTITY.PROMOTION))
  create(@Body() data: Promotion): Promise<boolean> {
    const { image } = data;
    delete data.image;
    return this.promotionRepository.create(data, image);
  }

  @UseGuards(AuthenticationGuard)
  @Put('/update/:id')
  @UsePipes(new AcceptedProps(ENTITY.PROMOTION))
  update(
    @Param('id') id: string,
    @Body() data: Partial<Promotion>,
  ): Promise<boolean> {
    const { image } = data;
    delete data.image;
    return this.promotionRepository.update(id, data, image);
  }
  @UseGuards(AuthenticationGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.promotionRepository.delete(id);
  }
}
