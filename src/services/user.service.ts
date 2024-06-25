import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/users';
import { UserDto } from 'src/validation/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>){}

    async FindAll(){
        return await this.userRepository.findAndCount({relations: ['role']})
    }

    async FindOne(username: string, password?: string): Promise<Users | undefined>{
        return await this.userRepository.findOne({where: {username: username, password: password,}, relations:["role"]});
    }

    async UpdateUserInfor(id: number, updateInfor: UserDto): Promise<any>{
        const action = await this.userRepository.update({id}, 
                        {firstName: updateInfor.firstName, lastName: updateInfor.lastName, 
                        phoneNum: updateInfor.phoneNum, password: updateInfor.password,
                        email: updateInfor.email, bio: updateInfor.bio,
                        profilePicturePath: updateInfor.profilePicturePath
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