import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
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
            throw new NotAcceptableException("Tag name must not include space !")
        await this.tagRepository.insert({name: tag.name});
        return {message: "Successful !"};
    }

    async FindTag(name?: string): Promise<[Tags[], number] | undefined>{
        const tag = await this.tagRepository.findAndCount({where: {name: Like('%' + name + '%')}});
        if(!tag)
            throw new NotFoundException("Tag not found");
        return tag;
    }

    async FindTagById(id: number): Promise<Tags| any>{
        const tag =  await this.tagRepository.findOneBy({id})
        if(!tag)
            throw new NotFoundException("Tag not found !");
        return tag;
    }

    async GetPostTag(postId: number): Promise<[Tags[], number] | any>{
        const postTags = await this.tagRepository.findAndCount({where: {posts: {id: postId}}});
        if(!postTags)
            throw new NotFoundException("Post not found !");
        return postTags;
    }

    async UpdateTag(id: number, updateTag: TagDto): Promise<any>{
        const isTagExist = await this.tagRepository.findOne({where: {name: updateTag.name}});
        if(isTagExist)
            throw new NotAcceptableException("This tag name is already taken !");
        if(updateTag.name.includes(" "))
            throw new NotAcceptableException("Tag name must not include space !")
        const action =  await this.tagRepository.update({id}, {name: updateTag.name});
        if(action.affected === 0)
            return {message: "Update failed !"};
        return {message: "Update successfully !"};
    }

    async deleteTag(id: number){
        const action = await this.tagRepository.delete({id});
        if(action.affected === 0)
            throw new NotFoundException("Tag Not Found !");
        return {message: "Deleted !"};
    }
}
