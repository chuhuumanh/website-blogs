import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/users';
import { createLoginDto } from 'src/validation/account.schema';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>){}

    async FindOne(username: string, password?: string): Promise<Users | undefined>{
        return await this.userRepository.findOne({where: {username: username, password: password,}, relations:["role"]});
    }
}
