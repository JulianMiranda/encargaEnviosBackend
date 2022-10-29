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
import { MyShop } from 'src/dto/my-shop.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { AcceptedProps } from '../../pipes/accepted-props.pipe';
import { RequiredProps } from '../../pipes/required-props.pipe';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { ShopRepository } from './shop.repository';

@Controller(ENTITY.MYSHOP)
@UseGuards(AuthenticationGuard)
export class ShopController {
  constructor(private shopRepository: ShopRepository) {}

  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.shopRepository.getList(query);
  }

  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<MyShop> {
    return this.shopRepository.getOne(id);
  }

  @Get('/getMyShop')
  getMyShop(@Req() req: any): Promise<Array<any>> {
    return this.shopRepository.getMyShop(req.user.id);
  }

  @Post('/setMyShop')
  @UsePipes(new RequiredProps(ENTITY.MYSHOP))
  setMyShop(@Body() data: MyShop): Promise<boolean> {
    return this.shopRepository.setMyShop(data);
  }

  @Get('/checkCategories')
  checkCategories(@Req() req: any): Promise<any> {
    return this.shopRepository.checkCategories(req.user.id);
  }

  @Post('/create')
  @UsePipes(new RequiredProps(ENTITY.MYSHOP))
  create(@Body() data: MyShop): Promise<boolean> {
    return this.shopRepository.create(data);
  }

  @Put('/update/:id')
  @UsePipes(new AcceptedProps(ENTITY.MYSHOP))
  update(
    @Param('id') id: string,
    @Body() data: Partial<MyShop>,
  ): Promise<boolean> {
    return this.shopRepository.update(id, data);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.shopRepository.delete(id);
  }
}
