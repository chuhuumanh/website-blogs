import { BadRequestException, ConflictException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagDto } from 'src/validation/tag.dto';
import { In, Like, Repository } from 'typeorm';
import { Tags } from './tags.entity';

@Injectable()
export class TagService {
    constructor(@InjectRepository(Tags) private tagRepository: Repository<Tags>){}

    async add(tag: TagDto): Promise<object>{
        const isTagExist = await this.tagRepository.findOne({where: {name: tag.name}});
        if(isTagExist)
            throw new NotAcceptableException("This tag is already Exist !");
        if(tag.name.includes(" "))
            throw new NotAcceptableException("Tag name must not include space !")
        await this.tagRepository.insert({name: tag.name});
        return {message: "Successful !"};
    }

    async findTag(name?: string): Promise<[Tags[], number] | null>{
        const tag = await this.tagRepository.findAndCount({where: {name: Like('%' + name + '%')}});
        if(!tag)
            throw new NotFoundException("Tag not found");
        return tag;
    }

    async getTagByName(name: string): Promise<Tags| any>{
        const tag = await this.tagRepository.findOneBy({name});
        if(!tag)
            throw new NotFoundException('Tag not found !');
    }

    async findTagById(id: number): Promise<Tags| any>{
        const tag =  await this.tagRepository.findOneBy({id})
        if(!tag)
            throw new NotFoundException("Tag not found !");
        return tag;
    }

    async findTagsById(id: Array<number>): Promise<Tags[]| any>{
        const tag =  await this.tagRepository.findBy({id: In(id)})
        if(!tag)
            throw new NotFoundException("Tag not found !");
        return tag;
    }

    async getPostTag(postId: number): Promise<[Tags[], number] | any>{
        const postTags = await this.tagRepository.findAndCount({where: {posts: {id: postId}}});
        if(!postTags)
            throw new NotFoundException("Post not found !");
        return postTags;
    }

    async updateTag(id: number, updateTag: TagDto): Promise<any>{
        const isTagExist = await this.tagRepository.findOne({where: {name: updateTag.name}});
        if(isTagExist)
            throw new ConflictException("This tag name is already taken !");
        if(updateTag.name.includes(" "))
            throw new BadRequestException("Tag name must not include space !")
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
