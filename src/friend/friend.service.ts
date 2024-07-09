import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from './friends.entity';
import { Repository } from 'typeorm';
import { DatetimeService } from 'src/datetime/datetime.service';
import { FindManyOptions } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ActionService } from 'src/action/action.service';
import { NotificationService } from 'src/notification/notification.service';
import { WsConnectionAuth } from 'src/auth/ws.connection.auth.guard';
import { Socket } from 'dgram';
import { Server } from 'http';
@Injectable()
export class FriendService {
    constructor(@InjectRepository(Friends)private friendRepository: Repository<Friends>, private dateTimeService: DatetimeService,
                private userService: UserService, private actionService: ActionService, private notificationService: NotificationService,
                private wsConnectionAuth: WsConnectionAuth){}

    async canActivate(client: Socket, server: Server){
        const isAuth = await this.wsConnectionAuth.canActivate(client);
        if(!isAuth){
            server.emit('connection', 'Unauthorize !');
            client.disconnect();
        }
    }

    async getUserFriends(options: object): Promise<[Friends[], number]>{
        const conditions: FindManyOptions<Friends> = {
            where: [
              { userReceiveRequestId: options['userId']},
              { userReceiveRequestId: options['userId'] },
              { isAccept: options['isAccept']}
            ],
          };
        return await this.friendRepository
        .findAndCount({
            where: conditions.where,
            relations: ['userSentRequest'],
            skip: options['page'] - 1,
            take: options['take']
        });
    }

    async sendFriendRequest(currentUserId: number, friendId: number): Promise<object|any>{
        const options = {
            id: friendId
        }
        await this.userService.findOne(options)
        const action = await this.actionService.findOneByName('friendRequest');
        const isRequestSent = await this.getFriendRequest(currentUserId, friendId);
        let notification = null;
        if(!isRequestSent){
            notification = await this.notificationService.add(action.id, currentUserId, friendId, null);
            await this.friendRepository.insert({userSentRequest: {id: currentUserId}, userReceiveRequestId: friendId, isAccept: false, 
                addedDate: this.dateTimeService.getDateTimeString()})
        }
        return notification;
    }

    async getFriendRequest( userId: number, friendId: number): Promise<object|any>{
        return await this.friendRepository.findOne({where: {userSentRequest:{id: userId}, userReceiveRequestId: friendId}})
    }

    async handleFriendRequest(currentUserId: number, friendId: number, isAccept: boolean): Promise<object| any>{
        const options = {
            id: friendId
        }
        await this.userService.findOne(options);
        let notification = null;
        if(isAccept){
            const action = await this.actionService.findOneByName('accept friend request');
            notification = await this.notificationService.add(action.id, currentUserId, friendId, null);
        }
        else await this.deleteFriend(currentUserId, friendId);
        const friendRequest = await this.friendRepository.findOneBy({userReceiveRequestId: currentUserId, userSentRequest: {id: friendId}});
        await this.friendRepository.update({id: friendRequest.id}, {isAccept: true});
        return notification;
    }

    async deleteFriend(friendId: number, userId: number){
        const options = {
            id: friendId
        }
        await this.userService.findOne(options);
        await this.friendRepository.delete({userSentRequest: {id: friendId || userId}, userReceiveRequestId: userId || friendId});
    }

    async deleteUserFriends(userId: number){
        await this.friendRepository.delete({userSentRequest: {id: userId}});
    }
}
