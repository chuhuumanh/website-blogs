import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from './friends';
import { Repository } from 'typeorm';
import { DatetimeService } from 'src/datetime/datetime.service';

@Injectable()
export class FriendService {
    constructor(@InjectRepository(Friends)private friendRepository: Repository<Friends>, private dateTimeService: DatetimeService){}

    async getUserFriends(userId: number, isAccept: boolean): Promise<[Friends[], number]>{
        return await this.friendRepository.findAndCountBy({userSentRequest: {id: userId}, isAccept: isAccept});
    }

    async sendFriendRequest(currentUserId: number, friendId: number): Promise<object|any>{
        await this.friendRepository.insert({userSentRequest: {id: currentUserId}, userReceiveRequestId: friendId, isAccept: false, 
            addedDate: this.dateTimeService.getDateTimeString()})
        return{message: 'Friend request sent !'};
    }

    async getFriendRequest(friendId: number, userId: number): Promise<object|any>{
        return await this.friendRepository.findOne({where: {userSentRequest:{id: userId}, userReceiveRequestId: friendId}})
    }

    async acceptFriendRequest(currentUserId: number, friendId: number): Promise<object| any>{
        const friendRequest = await this.friendRepository.findOneBy({userReceiveRequestId: currentUserId, userSentRequest: {id: friendId}});
        console.log(friendRequest);
        await this.friendRepository.update({id: friendRequest.id}, {isAccept: true});
        return{message: 'Friend request accepted !'};
    }

    async deleteFriend(friendId: number, userId: number){
        await this.friendRepository.delete({userSentRequest: {id: friendId || userId}, userReceiveRequestId: userId || friendId});
    }
}