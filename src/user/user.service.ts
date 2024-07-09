import {Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { UserRegisterDto } from 'src/validation/user.register.dto';
import { UserUpdateDto } from 'src/validation/user.update.dto';
import { ForbiddenException } from '@nestjs/common';
@Injectable()
export class UserService {

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>){}

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
