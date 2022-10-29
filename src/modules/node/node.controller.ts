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
import { Node } from 'src/dto/node.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { AcceptedProps } from '../../pipes/accepted-props.pipe';
import { RequiredProps } from '../../pipes/required-props.pipe';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { NodeRepository } from './node.repository';

@Controller(ENTITY.NODE)
export class NodeController {
  constructor(private nodeRepository: NodeRepository) {}

  @Post('/getListUnAuth')
  @UsePipes(new TransformQuery())
  getListUnAuth(@Body() query: MongoQuery): any {
    return this.nodeRepository.getList(query);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.nodeRepository.getList(query);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<Node> {
    return this.nodeRepository.getOne(id);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/create')
  @UsePipes(new RequiredProps(ENTITY.NODE))
  create(@Body() data: Node): Promise<boolean> {
    return this.nodeRepository.create(data);
  }

  @UseGuards(AuthenticationGuard)
  @Put('/update/:id')
  @UsePipes(new AcceptedProps(ENTITY.NODE))
  update(
    @Param('id') id: string,
    @Body() data: Partial<Node>,
  ): Promise<boolean> {
    return this.nodeRepository.update(id, data);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.nodeRepository.delete(id);
  }
}
