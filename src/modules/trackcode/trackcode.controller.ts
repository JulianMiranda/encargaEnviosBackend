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
import { Trackcode } from 'src/dto/trackcode.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { AcceptedProps } from '../../pipes/accepted-props.pipe';
import { RequiredProps } from '../../pipes/required-props.pipe';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { TrackcodeRepository } from './trackcode.repository';

@Controller(ENTITY.TRACKCODE)
export class TrackcodeController {
  constructor(private trackcodeRepository: TrackcodeRepository) {}

  @Post('/getListUnAuth')
  @UsePipes(new TransformQuery())
  getListUnAuth(@Body() query: MongoQuery): any {
    return this.trackcodeRepository.getList(query);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.trackcodeRepository.getList(query);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<Trackcode> {
    return this.trackcodeRepository.getOne(id);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/create')
  @UsePipes(new RequiredProps(ENTITY.TRACKCODE))
  create(@Body() data: Trackcode): Promise<boolean> {
    return this.trackcodeRepository.create(data);
  }

  @UseGuards(AuthenticationGuard)
  @Put('/update/:id')
  @UsePipes(new AcceptedProps(ENTITY.TRACKCODE))
  update(
    @Param('id') id: string,
    @Body() data: Partial<Trackcode>,
  ): Promise<boolean> {
    return this.trackcodeRepository.update(id, data);
  }

  @UseGuards(AuthenticationGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.trackcodeRepository.delete(id);
  }

  @Get('/checkCodesStatus')
  checkCodesStatus(): Promise<any> {
    return this.trackcodeRepository.checkCodesStatus();
  }
}
