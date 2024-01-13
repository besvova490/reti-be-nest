import { Module } from '@nestjs/common';

// services
import { SocketService } from './socket/socket.service';

// gateways
import { SocketGateway } from './socket/socket.gateway';

@Module({
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
