import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Tags } from 'src/entity/tags';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TagDto } from 'src/validation/tag.dto';

@Injectable()
export class TagService {
    constructor(@InjectRepository(Tags) private tagRepository: Repository<Tags>){}

    async Add(tag: TagDto): Promise<any>{
        const isTagExist = await this.tagRepository.findOne({where: {name: tag.name}});
        if(isTagExist)
            throw new NotAcceptableException("This tag is already Exist !");
        if(tag.name.includes(" "))
            throw new NotAcceptableException("Tag must not include space !")
        await this.tagRepository.insert({name: tag.name});
        return {message: "Successful !"};
    }


    async FindTag(name?: string): Promise<[Tags[], number] | undefined>{
        return await this.tagRepository.findAndCount({where: {name: Like('%' + name + '%')}});
    }

    async UpdateTag(id: number, updateTag: TagDto): Promise<any>{
        return await this.tagRepository.update({id}, {name: updateTag.name})
    }

    async deleteTag(id: number){
        const action = await this.tagRepository.delete({id});
    }
}
