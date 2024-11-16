import { ConfigService } from '@nestjs/config';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/users/users.service';

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
export class CallsGateway implements OnGatewayDisconnect {
  constructor(private userService: UserService){
  }

  queue: Queue = new Map()
  pool: Pool = new Map()
  @WebSocketServer()
  server: Server;

  decodeJWT(jwt: string){
    return this.userService.validateJWT(jwt)
  }

  @SubscribeMessage('entered')
  async handleClientCall(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const {token, id} = JSON.parse(data)
    const user = this.decodeJWT(token)

  }

  handleDisconnect(client: any) {
    console.log("dis")
  }



}
