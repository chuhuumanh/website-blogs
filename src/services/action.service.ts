import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actions } from 'src/entity/actions';
import { Repository } from 'typeorm';

@Injectable()
export class ActionService {
    constructor(@InjectRepository(Actions) private actionRepository: Repository<Actions>){}
    async FindOne(actionName: string):Promise<Actions>{
        return await this.actionRepository.findOne({where: {name: actionName}});
    }
}
