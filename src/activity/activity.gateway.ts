import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Body, UnauthorizedException, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { ActivityCreateDto } from 'src/validation/activity.create.dto';
import { ActionService } from 'src/action/action.service';
import { ActivityService } from './activity.service';
import { PostService } from 'src/post/post.service';
import { NotificationService } from 'src/notification/notification.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { ParseMessageBodyPipe } from 'src/validation/parse.message.body.pipe';
import { Socket } from 'dgram';
import { AuthGuardGateWay } from 'src/auth/auth.gateway.guard.guard';
import { Server } from 'http';
import { GateWayFilter } from 'src/validation/gateway.filter';
import { WsConnectionAuth } from 'src/auth/ws.connection.auth.guard';

@UseFilters(new GateWayFilter())
@UseGuards(AuthGuardGateWay)
@WebSocketGateway()
export class ActivityGateway implements OnGatewayConnection{
  constructor(private activityService: ActivityService, private actionService: ActionService, 
    private notificationService: NotificationService, private postService: PostService, private wsConnectionAuth: WsConnectionAuth){}
  @WebSocketServer()
  server: Server

  
  async handleConnection(client: Socket, ...args: any[]) {
    const canActivate = await this.wsConnectionAuth.canActivate(client);
    if(!canActivate){
      this.server.emit('connection', 'Unauthorize !')
      client.disconnect();
    }     
  }

  @SubscribeMessage('unauthorize')
  handleUnauthorizeMessage(){
    return {message: 'Unauthorize'}
  }

  @SubscribeMessage('activities')
  async actionPerform(@MessageBody(new ParseMessageBodyPipe, new ValidationPipe) activityDto: ActivityCreateDto, @ConnectedSocket() client: Socket){
    activityDto.userId = JSON.parse(client['user'].profile).id;
    const actionPerformed = await this.actionService.findOneByName(activityDto.action);
    let perform = null;
    if(actionPerformed.name === "comment")
        perform = await this.activityService.publishComment(activityDto);
    else perform = await this.activityService.performAction(actionPerformed, activityDto);
    if(perform.notify){
        const postOwnerId = (await this.postService.findOneById(activityDto.postId)).user.id;
        let notification = await this.notificationService.getByPostIdAndUserId(activityDto.userId, activityDto.postId, actionPerformed.id);
        if(!notification || actionPerformed.name === 'comment'){
          const notificationId = await this.notificationService.add(actionPerformed.id, activityDto.userId, postOwnerId, activityDto.postId);
          notification = await this.notificationService.getNotificationById(notificationId.id);
        }
        const user = postOwnerId.toString();
        this.server.emit(user, notification)
    }
    return perform
  }
}
