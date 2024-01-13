import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connections: Map<string, Socket> = new Map();

  handleConnection(socket: Socket) {
    const clientId = socket.id;
    this.connections.set(clientId, socket);

    socket.on('disconnect', () => {
      this.connections.delete(clientId);
    });
  }

  gatAllConnections() {
    return this.connections;
  }
}
