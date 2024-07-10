import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './roles.entity';

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Roles)private roleRepository: Repository<Roles>){}
    async findOne(name: string): Promise<Roles | undefined>{
        return await this.roleRepository.findOne({where: {name: name}});
    }
}
