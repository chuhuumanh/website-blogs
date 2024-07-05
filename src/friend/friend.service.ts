import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from './friends';
import { Repository } from 'typeorm';
import { DatetimeService } from 'src/datetime/datetime.service';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class FriendService {
    constructor(@InjectRepository(Friends)private friendRepository: Repository<Friends>, private dateTimeService: DatetimeService){}

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

    async deleteUserFriends(userId: number){
        await this.friendRepository.delete({userSentRequest: {id: userId}});
    }
}
