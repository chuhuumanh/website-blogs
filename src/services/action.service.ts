import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actions } from 'src/entity/actions';
import { Repository } from 'typeorm';

@Injectable()
export class ActionService {
    constructor(@InjectRepository(Actions) private actionRepository: Repository<Actions>){}
    async FindOneByName(actionName: string):Promise<Actions>{
        const action = await this.actionRepository
            .findOne({
                where: {
                    name: actionName
                }
            }
        );
        if(!action)
            throw new BadRequestException('Action Invalid');
        return action;
    }
}
