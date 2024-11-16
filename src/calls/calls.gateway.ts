import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type Common = {
  Id: string,
  PeerId: string,
  SocketId: string,
}
type Client = {
  timeEntered: Date
} & Common

type Queue = Map<string, Client>
type Pool = Map<string, Common>

type ClientData = {
  token: string
  id: string
}

@WebSocketGateway(90, { cors: true })
export class CallsGateway {

  queue: Queue = new Map()
  @WebSocketServer()
  server: Server;


  @SubscribeMessage('entered')
  async handleClientCall(@MessageBody() data: ClientData, @ConnectedSocket() client: Socket) {
    // Notify all available operators about the new call
    console.log(data)
  }

  @SubscribeMessage('accept-call')
  async handleAcceptCall(@MessageBody() data: any, @ConnectedSocket() operator: Socket) {
    // Notify the client about the accepted call
    this.server.to(data.clientId).emit('call-accepted', { operatorId: operator.id });
  }


}
