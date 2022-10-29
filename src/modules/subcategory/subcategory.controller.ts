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
import { Subcategory } from 'src/dto/subcategory.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { AcceptedProps } from '../../pipes/accepted-props.pipe';
import { RequiredProps } from '../../pipes/required-props.pipe';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { SubcategoryRepository } from './subcategory.repository';

@Controller(ENTITY.SUBCATEGORY)
export class SubcategoryController {
  constructor(private subcategoryRepository: SubcategoryRepository) {}

  @Post('/getListUnAuth')
  @UsePipes(new TransformQuery())
  getListUnAuth(@Body() query: MongoQuery): any {
    return this.subcategoryRepository.getList(query);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.subcategoryRepository.getList(query);
  }
  @UseGuards(AuthenticationGuard)
  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<Subcategory> {
    return this.subcategoryRepository.getOne(id);
  }
  @UseGuards(AuthenticationGuard)
  @Post('/create')
  @UsePipes(new RequiredProps(ENTITY.SUBCATEGORY))
  create(@Body() data: Subcategory): Promise<boolean> {
    const { images } = data;
    delete data.images;
    return this.subcategoryRepository.create(data, images);
  }
  @UseGuards(AuthenticationGuard)
  @Put('/update/:id')
  @UsePipes(new AcceptedProps(ENTITY.SUBCATEGORY))
  update(
    @Param('id') id: string,
    @Body() data: Partial<Subcategory>,
  ): Promise<boolean> {
    const { images, deleteImages } = data;
    delete data.images;
    delete data.deleteImages;
    return this.subcategoryRepository.update(id, data, images, deleteImages);
  }
  @UseGuards(AuthenticationGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.subcategoryRepository.delete(id);
  }
  @UseGuards(AuthenticationGuard)
  @Get('/setPrice')
  setPrice(): Promise<boolean> {
    return this.subcategoryRepository.setPrice();
  }

  @Get('/getProduct/:id')
  getProduct(@Param('id') id: string): Promise<Subcategory> {
    return this.subcategoryRepository.getProduct(id);
  }
}
