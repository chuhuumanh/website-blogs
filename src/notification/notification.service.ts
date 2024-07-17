import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { DatetimeService } from 'src/datetime/datetime.service';
import { Repository } from 'typeorm';
import { Notifications } from './notifications.entity';
import { time } from 'console';
import { number } from 'zod';

@Injectable()
export class NotificationService {
    constructor(@InjectRepository(Notifications) private notificationRepository: Repository<Notifications>, 
    private dateTimService: DatetimeService, private schedulerRegistry: SchedulerRegistry){}

    private readonly logger = new Logger(NotificationService.name)

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

    addCronJob(name: string){
        try{
            this.schedulerRegistry.getCronJob(name);
        }
        catch{
            const job = new CronJob('* * 8 * * 1-7', () =>{
                this.logger.warn(`Added user's daily notification`);
            });
    
            this.schedulerRegistry.addCronJob(name, job);
            job.start();
            this.logger.warn('Daily notifications');
        }
    }

    addInterval(name: string, seconds: number){
        const callback = () =>{
            this.logger.warn(`Interval ${name} active per ${seconds} seconds`);
        }
        const interval = setInterval(callback, seconds);
        this.schedulerRegistry.addInterval(name, interval);
    }

    addTimeout(name: string, seconds: number){
        const callback = () => {
            this.logger.warn(`Timeout ${name} execute after ${seconds} seconds !`);
        }
        const timeout = setTimeout(callback, seconds)
        this.schedulerRegistry.addTimeout(name, timeout);
    }

}
