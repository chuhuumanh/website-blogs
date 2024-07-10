import { UseFilters } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'http';
import { Role, Roles } from 'src/role/role.decorator';
import { GateWayFilter } from 'src/validation/gateway.filter';
import { ParseMessageBodyBoolPipe } from 'src/validation/parse.message.body.bool.pipe';
import { ParseMessageBodyIntPipe } from 'src/validation/parse.message.body.int.pipe';
import { ParseMessageBodyPipe } from 'src/validation/parse.message.body.pipe';
import { FriendService } from './friend.service';
@WebSocketGateway()
@Roles(Role.Admin, Role.User)
@UseFilters(new GateWayFilter())
export class FriendGateway implements OnGatewayConnection {
  constructor(private friendService: FriendService){}
  @WebSocketServer()
  server: Server

  async handleConnection(client: Socket, ...args: any[]) {
    await this.friendService.canActivate(client, this.server);
  }

  @SubscribeMessage('friendRequestSend')
  async sendFriendRequest(@MessageBody(new ParseMessageBodyPipe, new ParseMessageBodyIntPipe('userReceiveRequestId')) userReceiveRequestId: number, 
  @ConnectedSocket() client: Socket){
    const userSendRequest = JSON.parse(client['user'].profile);
    const notification = await this.friendService.sendFriendRequest(userSendRequest.id, userReceiveRequestId);
    this.server.emit(userReceiveRequestId.toString(), notification);
    return 'Request sent !';
  }

  @SubscribeMessage('friendRequestHandle')
  async handleFriendRequest(@ConnectedSocket() client: Socket, 
    @MessageBody(new ParseMessageBodyPipe, new ParseMessageBodyBoolPipe('isAccept')) isAccept: boolean){
    const userSendRequestId = client['handshake'].query.userSendRequestId;
    const userReceiveRequestId = JSON.parse(client['user'].profile).id;
    const notification = await this.friendService.handleFriendRequest(userReceiveRequestId, userSendRequestId, isAccept);
    this.server.emit(userSendRequestId, notification);
  }
}
