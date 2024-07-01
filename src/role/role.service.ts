import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './roles';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Roles)private roleRepository: Repository<Roles>){}
    async FindOne(name: string): Promise<Roles | undefined>{
        return await this.roleRepository.findOne({where: {name: name}});
    }
}
