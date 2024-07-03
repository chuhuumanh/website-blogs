import {Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users';
import { Repository } from 'typeorm';
import { UserRegisterDto } from 'src/validation/user.register.dto';
import { UserUpdateDto } from 'src/validation/user.update.dto';

@Injectable()
export class UserService {

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>){}

    async add(newUser: UserRegisterDto){
        return await this.userRepository.insert(newUser);
    }

    async findAll(){
        return await this.userRepository.findAndCount({relations: ['role']})
    }

    async findOne(username?: string, password?: string, userId?: number): Promise<Users | undefined>{
        return await this.userRepository.findOne({where: {username: username, password: password, id: userId}, relations:["role"]});
    }

    async findUserProfilePicture(id: number, path: string){
        const user = await this.userRepository.findOneBy({id});
        if(!user)
            throw new NotFoundException('User not found !');
        if(user.profilePicturePath !== path)
            throw new NotFoundException('Profile image not found !');
        return user;
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

    async deleteUser(id: number){
        const action = await this.userRepository.delete({id});
        if(action.affected === 0)
            throw new NotFoundException("User Not Found !")
        return {message: "Deleted !"};
    }
}
