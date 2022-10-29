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
import { Carnet } from 'src/dto/carnet.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { AcceptedProps } from '../../pipes/accepted-props.pipe';
import { RequiredProps } from '../../pipes/required-props.pipe';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { CarnetRepository } from './carnet.repository';

@Controller(ENTITY.CARNET)
export class CarnetController {
  constructor(private carnetRepository: CarnetRepository) {}

  @UseGuards(AuthenticationGuard)
  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.carnetRepository.getList(query);
  }

  @Post('/getListUnAuth')
  @UsePipes(new TransformQuery())
  getListUnAuth(@Body() query: MongoQuery): any {
    return this.carnetRepository.getListUnAuth(query);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<Carnet> {
    return this.carnetRepository.getOne(id);
  }
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  @UsePipes(new RequiredProps(ENTITY.CARNET))
  create(@Body() data: Carnet): Promise<boolean> {
    return this.carnetRepository.create(data);
  }
  @UseGuards(AuthenticationGuard)
  @Put('/update/:id')
  @UsePipes(new AcceptedProps(ENTITY.CARNET))
  update(
    @Param('id') id: string,
    @Body() data: Partial<Carnet>,
  ): Promise<boolean> {
    return this.carnetRepository.update(id, data);
  }
  @UseGuards(AuthenticationGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.carnetRepository.delete(id);
  }
}
