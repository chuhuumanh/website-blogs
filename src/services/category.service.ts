import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category';
import { CategoryDto } from 'src/validation/category.dto';
import { Repository, Like } from 'typeorm';
import { NotAcceptableException, NotFoundException } from '@nestjs/common';
@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>){}

    async Add(category: CategoryDto): Promise<any>{
        const isCategoryExist = await this.categoryRepository.findOne({where: {name: category.name}});
        if(isCategoryExist)
            throw new NotAcceptableException("This category is already Exist !");
        await this.categoryRepository.insert({name: category.name, descriptions: category.descriptions});
        return {message: "Successful !"};
    }

    async AddPostCategory(){
        
    }

    async FindCategory(name?: string): Promise<[Category[], number] | undefined>{
        return await this.categoryRepository.findAndCount({where: {name: Like('%' + name + '%')}});
    }

    async getPostCategory(postId: number): Promise<[Category[], number]| any>{
        return await this.categoryRepository.findAndCount({where: {posts: {id: postId}}});
    }

    async UpdateCategory(id: number, updateCategory: CategoryDto): Promise<any>{
        const isCategoryExist = await this.categoryRepository.findOne({where: {name: updateCategory.name}});
        if(isCategoryExist)
            throw new NotAcceptableException("This category name is already taken !");
        const action =  await this.categoryRepository.update({id}, {name: updateCategory.name});
        if(action.affected === 0)
            return {message: "Update failed !"};
        return {message: "Update successfully !"};
    }

    async deleteCategory(id: number){
        const action = await this.categoryRepository.delete({id});
        if(action.affected === 0)
            throw new NotFoundException("Category Not Found !");
        return {message: "Deleted !"};
    }
}