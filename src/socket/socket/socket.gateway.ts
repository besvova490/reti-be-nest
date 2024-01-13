import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

// services
import { SocketService } from './socket.service';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  private server: Socket;

  handleConnection(socket: Socket) {
    this.socketService.handleConnection(socket);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('message', '123');
  }
}
