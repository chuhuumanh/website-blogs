import { ConnectedSocket, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageBody } from '@nestjs/websockets';
import { ParseIntPipe, ParseBoolPipe, Param, UseGuards, UseFilters, NotFoundException } from '@nestjs/common';
import { Socket } from 'dgram';
import { Server } from 'http';
import { FriendService } from './friend.service';
import { UserService } from 'src/user/user.service';
import { Role, Roles } from 'src/role/role.decorator';
import { NotificationService } from 'src/notification/notification.service';
import { ActionService } from 'src/action/action.service';
import { GateWayFilter } from 'src/validation/gateway.filter';
import { ParseMessageBodyPipe } from 'src/validation/parse.message.body.pipe';
import { ParseMessageBodyIntPipe } from 'src/validation/parse.message.body.int.pipe';
import { ParseMessageBodyBoolPipe } from 'src/validation/parse.message.body.bool.pipe';
import { WsConnectionAuth } from 'src/auth/ws.connection.auth.guard';
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
