import { Controller, Get } from '@nestjs/common';

// services
import { MessageService } from './messages.service';

@Controller('messages')
export class MessageController {
  constructor(private messagesService: MessageService) {}

  @Get(':roomId')
  getRoomMessages() {
    return this.messagesService.findAll();
  }
}
