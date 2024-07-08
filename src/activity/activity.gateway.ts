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

  @SubscribeMessage('activities')
  async actionPerform(@MessageBody(new ParseMessageBodyPipe, new ValidationPipe) activityDto: ActivityCreateDto, @ConnectedSocket() client: Socket){
    activityDto.userId = JSON.parse(client['user'].profile).id;
    const actionPerformed = await this.actionService.findOneByName(activityDto.action);
    let perform = await this.activityService.performAction(actionPerformed, activityDto);
    this.server.emit(perform['notification'].receiverId, perform['notification']);
    return perform;
  }
}
