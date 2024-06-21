import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/users';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>){}

    async FindOne(username: string, password?: string): Promise<Users | undefined>{
        return await this.userRepository.findOne({where: {username: username, password: password,}, relations:["role"]});
    }

    async UpdateName(id: number, firstName: string, lastName: string): Promise<any>{
            const action = await this.userRepository.update({id}, {firstName: firstName, lastName: lastName});
            if(action.affected === 0)
                throw new NotFoundException("User Not Found !");
            return {status: action.affected};
    }
}
