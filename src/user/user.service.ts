import {forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { UserRegisterDto } from 'src/validation/user.register.dto';
import { UserUpdateDto } from 'src/validation/user.update.dto';
import { ForbiddenException } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { FriendService } from 'src/friend/friend.service';
import { NotificationService } from 'src/notification/notification.service';
import { ImageService } from 'src/image/image.service';
import { ActivityService } from 'src/activity/activity.service';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UserService {

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>, @Inject(forwardRef(() => PostService))private postService: PostService,
                private friendService: FriendService, private notificationService: NotificationService,
                private imgService: ImageService, private activityService: ActivityService, 
                @Inject(forwardRef(() => AuthService))private authService: AuthService){}

    async add(newUser: UserRegisterDto): Promise<Users>{
        const user = await this.userRepository.save(newUser);
        return await this.userRepository.findOne({where: {id: user.id}, relations: ['role']});
    }

    async findAll(){
        return await this.userRepository.findAndCount({relations: ['role']})
    }

    async findOne(options: object): Promise<Users| null>{
        const user = await this.userRepository.findOne({where: options, relations: ['role']})
        if(!user)
            throw new NotFoundException('User not found !');
        return user;
    }

    async findPassword(username: string): Promise<string| null>{
        const user = await this.userRepository.createQueryBuilder().where('username = :username', {username}).select().addSelect('Users.password').getOne();
        return user.password;
    }

    async findUserProfilePicture(id: number, path: string){
        const user = await this.userRepository.findOneBy({id});
        if(!user)
            throw new NotFoundException('User not found !');
        if(user.profilePicturePath !== path)
            throw new NotFoundException('Profile image not found !');
        return user.profilePicturePath;
    }

    async getUserPost(options: object){
        await this.findOne(options);
        return await this.postService.getUserPost(options);
    }

    async getUserFriends(options: object){
        await this.findOne(options);
        return await this.friendService.getUserFriends(options);
    }

    async getFriendRequests(options: object){
        return await this.friendService.getUserFriends(options);
    }

    async getUserNotifications(options: object){
        return await this.notificationService.getUserNotifications(options);
    }

    async updateUserInfor(id: number, updateInfor: UserUpdateDto): Promise<any>{
        const action = await this.userRepository.update({id}, 
                        {firstName: updateInfor.firstName, lastName: updateInfor.lastName, 
                        phoneNum: updateInfor.phoneNum, password: updateInfor.password,
                        email: updateInfor.email, bio: updateInfor.bio,
                        profilePicturePath: updateInfor.profilePicturePath,
                        dateOfBirth: updateInfor.dateOfBirth, postPublishedCount: updateInfor.publishedPostCount
                        });
        
        if(action.affected === 0)
            throw new NotFoundException("User Not Found !");
        return {message: "Updated !"};
    }

    async deleteUser(req: any){
        const payload = JSON.parse(req.user.profile);
        const options = {
            id: payload.id
        }
        const user = await this.findOne(options);
        if(user.profilePicturePath)
            await this.imgService.deleteUserProfilePicture(user.profilePicturePath);
        await this.activityService.deleteUserActivities(user.id);
        await this.friendService.deleteUserFriends(user.id)
        await this.postService.deleteUserPost(user.id);
        await this.notificationService.deleteUserNotifications(user.id);
        await this.authService.logout(req.headers.authorization);
        const action = await this.userRepository.delete({id: user.id});
    }

}
