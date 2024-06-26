import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './notifications';
import { Repository } from 'typeorm';
import { DatetimeService } from 'src/datetime/datetime.service';
@Injectable()
export class NotificationService {
    constructor(@InjectRepository(Notifications) private notificationRepository: Repository<Notifications>, private dateTimService: DatetimeService){}
    private readonly subject = new Subject<any>();
    subscribe() {
        return this.subject.asObservable();
    }

    emit(data?: object) {
        this.subject.next({data});
    }

    async add(actionId: number, userId: number, receiverId: number, postId?: number){
        const activatedDate = this.dateTimService.getDateTimeString();
        return await this.notificationRepository.save({action: {id: actionId}, activedDate: activatedDate, 
            user: {id: userId}, post: {id: postId}, isSeen: false, receiverId: receiverId});
    }

    async getNotificationById(id: number){
        return await this.notificationRepository.find({where: {id}, relations: ['action']});
    }

    async getUserNotifications(userId: number){
        const results = await this.notificationRepository.find({where: {receiverId: userId}, relations: ['action', 'post', 'user']});
        const notifications = []
        for(const result of results){
            const noti = {
                userId: result.user.id,
                post: result.post,
                action: result.action,
                activedDate: result.activedDate
            }
            notifications.push(noti);
        }
        return notifications;
    }

    async delete(id: number){
        return await this.notificationRepository.delete({id});
    }
}
