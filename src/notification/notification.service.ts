import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatetimeService } from 'src/datetime/datetime.service';
import { Repository } from 'typeorm';
import { Notifications } from './notifications.entity';

@Injectable()
export class NotificationService {
    constructor(@InjectRepository(Notifications) private notificationRepository: Repository<Notifications>, 
    private dateTimService: DatetimeService){}

    async add(actionId: number, userId: number, receiverId: number, postId?: number): Promise<Notifications>{
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

    async getUserNotifications(options: object){
        const results = await this.notificationRepository
            .findAndCount({
                where: {
                    receiverId: options['userId']
                }, 
                relations: ['action', 'post', 'user'],
                skip: options['page'] - 1,
                take: options['take']
            });
        return results;
    }

    async deleteUserNotifications(userId: number){
        return await this.notificationRepository.createQueryBuilder().delete().where('userId =:userId', {userId}).
        orWhere('receiverId =:userId', {userId}).execute();
    }

    async deletePostNotifications(postId: number){
        return await this.notificationRepository.delete({post: {id: postId}});
    }

    async delete(id: number, userId: number){
        const notification = await this.getNotificationById(id);
        if(notification.receiverId !== userId)
            throw new ForbiddenException("Cannot delete other's notification");
        await this.notificationRepository.delete({id});
        return {message: 'Deleted notification'};
    }
}
