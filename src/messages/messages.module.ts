import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// services
import { MessageService } from './messages.service';

// controllers
import { MessageController } from './messages.controller';

// schemas
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessagesModule {}
