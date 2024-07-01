import {Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users';
import { UserDto } from 'src/validation/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>){}

    async Add(newUser: UserDto){
        return await this.userRepository.save(newUser);
    }

    async FindAll(){
        return await this.userRepository.findAndCount({relations: ['role']})
    }

    async FindOne(username?: string, password?: string, userId?: number): Promise<Users | undefined>{
        return await this.userRepository.findOne({where: {username: username, password: password, id: userId}, relations:["role"]});
    }

    async FindUserProfilePicture(id: number, path: string){
        const user = await this.userRepository.findOneBy({id});
        if(!user)
            throw new NotFoundException('User not found !');
        if(user.profilePicturePath !== path)
            throw new NotFoundException('Profile image not found !');
        return user;
    }

    async UpdateUserInfor(id: number, updateInfor: UserDto): Promise<any>{
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

    async deleteUser(id: number){
        const action = await this.userRepository.delete({id});
        if(action.affected === 0)
            throw new NotFoundException("User Not Found !")
        return {message: "Deleted !"};
    }
}
