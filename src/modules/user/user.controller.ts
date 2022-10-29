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
import { User } from 'src/dto/user.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { AcceptedProps } from '../../pipes/accepted-props.pipe';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { UserRepository } from './user.repository';

@Controller(ENTITY.USERS)
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.userRepository.getList(query);
  }

  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<User> {
    return this.userRepository.getOne(id);
  }
  @UseGuards(AuthenticationGuard)
  @Put('/update/:id')
  @UsePipes(new AcceptedProps(ENTITY.USERS))
  update(@Param('id') id: string, @Body() data: any): Promise<any> {
    const { image } = data;
    delete data.image;
    return this.userRepository.update(id, data, image);
  }
  @UseGuards(AuthenticationGuard)
  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
