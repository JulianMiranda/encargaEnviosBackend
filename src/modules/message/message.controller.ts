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
import { Message } from 'src/dto/message.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { MongoQuery } from '../../dto/mongo-query.dto';
import { ENTITY } from '../../enums/entity.enum';
import { TransformQuery } from '../../pipes/transform-query.pipe';
import { MessageRepository } from './message.repository';

@Controller(ENTITY.MESSAGES)
@UseGuards(AuthenticationGuard)
export class MessageController {
  constructor(private messageRepository: MessageRepository) {}

  @Post('/getList')
  @UsePipes(new TransformQuery())
  getList(@Body() query: MongoQuery): any {
    return this.messageRepository.getList(query);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/getMessages')
  getMessages(@Req() req): any {
    return this.messageRepository.getMessages(req.user.id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/getAdminMessages/:id')
  getAdminMessages(@Req() req, @Param('id') id: string): any {
    return this.messageRepository.getAdminMessages(req.user.id, id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/getUsersMessages')
  getUsersMessages(@Req() req): any {
    return this.messageRepository.getUsersMessages(req.user.id);
  }

  @Put('/setMessages/:id')
  setMessages(@Req() req, @Body() body: any, @Param('id') id: string): any {
    const payload: Partial<Message> = {
      de: req.user.id,
      para: id,
      message: body.message,
    };
    return this.messageRepository.setMessages(payload);
  }

  @Get('/getOne/:id')
  getOne(@Param('id') id: string): Promise<Message> {
    return this.messageRepository.getOne(id);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.messageRepository.delete(id);
  }
}
