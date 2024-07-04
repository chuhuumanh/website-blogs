import { ConnectedSocket, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageBody } from '@nestjs/websockets';
import { ParseIntPipe, ParseBoolPipe, Param, UseGuards, UseFilters, NotFoundException } from '@nestjs/common';
import { Socket } from 'dgram';
import { Server } from 'http';
import { FriendService } from './friend.service';
import { UserService } from 'src/user/user.service';
import { Role, Roles } from 'src/role/role.decorator';
import { AuthGuardGateWay } from 'src/auth/auth.gateway.guard.guard';
import { NotificationService } from 'src/notification/notification.service';
import { ActionService } from 'src/action/action.service';
import { GateWayFilter } from 'src/validation/gateway.filter';
import { ParseMessageBodyPipe } from 'src/validation/parse.message.body.pipe';
import { ParseMessageBodyIntPipe } from 'src/validation/parse.message.body.int.pipe';
import { ParseMessageBodyBoolPipe } from 'src/validation/parse.message.body.bool.pipe';
import { WsConnectionAuth } from 'src/auth/ws.connection.auth.guard';
@WebSocketGateway()
@UseGuards(AuthGuardGateWay)
@Roles(Role.Admin, Role.User)
@UseFilters(new GateWayFilter)
export class FriendGateway implements OnGatewayConnection {
  constructor(private friendService: FriendService, private userService: UserService, 
    private notificationService: NotificationService, private actionService: ActionService, private wsConnectionAuth: WsConnectionAuth){}
  @WebSocketServer()
  server: Server

  async handleConnection(client: Socket, ...args: any[]) {
    const canActivate = await this.wsConnectionAuth.canActivate(client);
    if(!canActivate){
      this.server.emit('connection', 'Unauthorize !')
      client.disconnect();
    }     
  }

  @SubscribeMessage('friendRequestSend')
  async sendFriendRequest(@MessageBody(new ParseMessageBodyPipe, new ParseMessageBodyIntPipe('userReceiveRequestId')) userReceiveRequestId: number, 
  @ConnectedSocket() client: Socket){
    await this.userService.findOne(undefined, undefined, userReceiveRequestId)
    const userSendRequest = JSON.parse(client['user'].profile);
    const action = await this.actionService.findOneByName('friendRequest');
    const isRequestSent = await this.friendService.getFriendRequest(userReceiveRequestId, userSendRequest.id);
    let notification = null;
    if(!isRequestSent){
      notification = await this.notificationService.add(action.id, userSendRequest.id, userReceiveRequestId, null);
      await this.friendService.sendFriendRequest(userSendRequest.id, userReceiveRequestId);
      const userReceiverRequest = userReceiveRequestId.toString()
      this.server.emit(userReceiverRequest, notification);
      return 'Request sent !';
    }
    return 'Request already sent !';
}

  @SubscribeMessage('friendRequestHandle')
  async handleFriendRequest(@ConnectedSocket() client: Socket, 
    @MessageBody(new ParseMessageBodyPipe, new ParseMessageBodyBoolPipe('isAccept')) isAccept: boolean){
    const userSendRequestId = client['handshake'].query.userSendRequestId;
    const isUserSendRequestExist = await this.userService.findOne(undefined, undefined, userSendRequestId);
    if(!isUserSendRequestExist)
      throw new NotFoundException('User send friend request not found');
    const userReceiveRequestId = JSON.parse(client['user'].profile).id;
    let notification = null;
    if(isAccept){
      const action = await this.actionService.findOneByName('accept friend request');
      notification = await this.notificationService.add(action.id, userReceiveRequestId, userSendRequestId, null);
      this.server.emit(userSendRequestId, notification);
      return await this.friendService.acceptFriendRequest(userReceiveRequestId, userSendRequestId);
    }
    return await this.friendService.deleteFriend(userSendRequestId, userReceiveRequestId)
  }
}
