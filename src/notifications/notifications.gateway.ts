import { UseFilters, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { AuthGuard } from 'src/auth/auth.guard';
import { SocketGuard } from './socket.filter';

@WebSocketGateway(8080)
@UseGuards(SocketGuard)
export class NotificationsGateway {
  @SubscribeMessage('notifications')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() body: string): WsResponse<any> {
    const event = 'notifications';
    const data = {message: "OK"}
    return {event, data};
  }
}
