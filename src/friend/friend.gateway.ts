import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageBody } from '@nestjs/websockets';
import { ParseIntPipe, ParseBoolPipe, Param, UseGuards, UseFilters } from '@nestjs/common';
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
@WebSocketGateway()
@UseGuards(AuthGuardGateWay)
@Roles(Role.Admin, Role.User)
@UseFilters(new GateWayFilter)
export class FriendGateway {
  constructor(private friendService: FriendService, private userService: UserService, 
    private notificationService: NotificationService, private actionService: ActionService){}
  @WebSocketServer()
  server: Server
  @SubscribeMessage('friendRequestSend')
  async sendFriendRequest(@MessageBody(new ParseMessageBodyPipe, new ParseMessageBodyIntPipe('userReceiveRequestId')) userReceiveRequestId: number, 
  @ConnectedSocket() client: Socket){
    await this.userService.findOne(undefined, undefined, userReceiveRequestId)
    const userSendRequest = JSON.parse(client['user'].profile);
    const action = await this.actionService.findOneByName('friendRequest');
    let notification = await this.notificationService.add(action.id, userSendRequest.id, userReceiveRequestId, null)
    const userReceiverRequest = userReceiveRequestId.toString()
    this.server.emit(userReceiverRequest, notification);
    return await this.friendService.sentFriendRequest(userSendRequest.id, userReceiveRequestId);
}

  @SubscribeMessage('friendRequestHandle')
  async handleFriendRequest(@Param('userSendRequestId', ParseIntPipe) userSendRequestId: number, @ConnectedSocket() client: Socket, 
    @MessageBody('isAccept', ParseBoolPipe) isAccept: boolean){
    await this.userService.findOne(undefined, undefined, userSendRequestId);
    const userReceiveRequest = JSON.parse(client['user'].profile).id;;
    if(isAccept)
      return await this.friendService.acceptFriendRequest(userReceiveRequest.id, userSendRequestId);
    return await this.friendService.deleteFriend(userSendRequestId, userReceiveRequest.id)
  }
}
