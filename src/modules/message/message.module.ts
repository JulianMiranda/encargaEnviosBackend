import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/schemas/message.schema';
import { UserSchema } from 'src/schemas/user.schema';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Message',
        schema: MessageSchema,
      },
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  providers: [MessageRepository],
  controllers: [MessageController],
})
export class MessageModule {}
