import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from './friends';
import { Repository } from 'typeorm';
import { DatetimeService } from 'src/datetime/datetime.service';

@Injectable()
export class FriendService {
    constructor(@InjectRepository(Friends)private friendRepository: Repository<Friends>, private dateTimeService: DatetimeService){}

    async GetUserFriends(userId: number, isAccept: boolean): Promise<[Friends[], number]>{
        return await this.friendRepository.findAndCountBy({userSentRequest: {id: userId}, isAccept: isAccept});
    }

    async SentFriendRequest(currentUserId: number, friendId: number): Promise<object|any>{
        await this.friendRepository.insert({userSentRequest: {id: currentUserId}, userReceiveRequestId: friendId, isAccept: false, 
            addedDate: this.dateTimeService.GetDateTimeString()})
        return{message: 'Friend request sent !'};
    }

    async HandleFriendRequest(currentUserId: number, friendId: number, isAccept: boolean): Promise<object| any>{
        const friendRequest = await this.friendRepository.findOneBy({userReceiveRequestId: currentUserId, userSentRequest: {id: friendId}});
        if(isAccept){
            friendRequest.isAccept = true;
            await this.friendRepository.save(friendRequest);
            return{message: 'Friend request accepted !'};
        }
        return{message: 'Friend request rejected !'}
    }
}
