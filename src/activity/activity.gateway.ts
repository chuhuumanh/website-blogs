import { UseFilters } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'http';
import { ActivityCreateDto } from 'src/validation/activity.create.dto';
import { GateWayFilter } from 'src/validation/gateway.filter';
import { ParseMessageBodyPipe } from 'src/validation/parse.message.body.pipe';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { ActivityService } from './activity.service';

@UseFilters(new GateWayFilter())
@WebSocketGateway()
export class ActivityGateway implements OnGatewayConnection{
  constructor(private activityService: ActivityService){}
  @WebSocketServer()
  server: Server

  async handleConnection(client: Socket, ...args: any[]) {
   await this.activityService.handleConnection(client, this.server);
  }

  @SubscribeMessage('activities')
  async actionPerform(@MessageBody(new ParseMessageBodyPipe, new ValidationPipe) activityDto: ActivityCreateDto, @ConnectedSocket() client: Socket){
    activityDto.userId = JSON.parse(client['user'].profile).id;
    let perform = await this.activityService.performAction(activityDto);
    this.server.emit(perform['notification'].receiverId, perform['notification']);
    return perform;
  }
}
