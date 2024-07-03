import { Injectable, NotFoundException } from '@nestjs/common';
import { Subject } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './notifications';
import { Repository } from 'typeorm';
import { DatetimeService } from 'src/datetime/datetime.service';

@Injectable()
export class NotificationService {
    constructor(@InjectRepository(Notifications) private notificationRepository: Repository<Notifications>, 
    private dateTimService: DatetimeService){}

    async add(actionId: number, userId: number, receiverId: number, postId?: number){
        const activatedDate = this.dateTimService.getDateTimeString();
        return await this.notificationRepository.save({action: {id: actionId}, activedDate: activatedDate, 
            user: {id: userId}, post: {id: postId}, isSeen: false, receiverId: receiverId});
    }

    async getNotificationById(id: number): Promise<Notifications>{
        const isNotificationExist =  await this.notificationRepository.findOne({where: {id}, relations: ['action', 'user', 'post']});
        if(!isNotificationExist)
            throw new NotFoundException('Notification not found !');
        return isNotificationExist;
    }

    async getByPostIdAndUserId(userId: number, postId: number, actionId: number): Promise<Notifications>{
        return await this.notificationRepository.findOne({where: {user: {id: userId}, post: {id: postId}, action: {id: actionId}}, relations: ['action', 'user', 'post']});
    }

    async getUserNotifications(userId: number){
        const results = await this.notificationRepository.findAndCount({where: {receiverId: userId}, relations: ['action', 'post', 'user']});
        return results;
    }

    async delete(id: number){
        await this.notificationRepository.delete({id});
        return {message: 'Deleted notification'};
    }
}
