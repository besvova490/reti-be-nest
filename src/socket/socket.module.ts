import { Module } from '@nestjs/common';

// models
import { MessagesModule } from '../messages/messages.module';

// services
import { SocketService } from './socket/socket.service';

// gateways
import { SocketGateway } from './socket/socket.gateway';

@Module({
  imports: [MessagesModule],
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
