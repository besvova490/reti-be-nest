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
import { MessageService } from '../../messages/messages.service';
import { SocketService } from './socket.service';

// helpers
import * as events from './events';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection {
  constructor(
    private socketService: SocketService,
    private messageService: MessageService,
  ) {}

  @WebSocketServer()
  private server: Socket;

  handleConnection(socket: Socket) {
    this.socketService.handleConnection(socket);
  }

  @SubscribeMessage(events.JOIN_ROOM)
  async handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data);
  }

  @SubscribeMessage(events.LEAVE_ROOM)
  handleLeaveRoom(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data);
  }

  @SubscribeMessage(events.MESSAGE)
  handleMessageEvent(
    @MessageBody() data: { content: string; to: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.messageService.create({
      content: data.content,
      from: JSON.stringify(client.handshake.auth),
      roomId: data.to,
      createdAt: new Date(),
    });

    this.server.to(data.to).emit(events.MESSAGE, {
      content: data.content,
      from: client.handshake.auth,
    });
  }
}
