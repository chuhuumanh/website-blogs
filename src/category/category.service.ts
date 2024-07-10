import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDto } from 'src/validation/category.dto';
import { In, Like, Repository } from 'typeorm';
import { Category } from './category.entity';
@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>){}

    async add(category: CategoryDto): Promise<any>{
        const isCategoryExist = await this.categoryRepository.findOne({where: {name: category.name}});
        if(isCategoryExist)
            throw new NotAcceptableException("This category is already Exist !");
        await this.categoryRepository.insert({name: category.name, descriptions: category.descriptions});
        return {message: "Successful !"};
    }

    async findCategoryById(id: number): Promise<Category | any>{
        const category = await this.categoryRepository.findOneBy({id});
        if(!category)
            throw new NotFoundException('Category not found');
        return category;
    }

    async findCategoriesById(id: Array<number>): Promise<Category | any>{
        const category = await this.categoryRepository.findBy({id: In(id)});
        if(!category)
            throw new NotFoundException('Category not found');
        return category;
    }

    async findCategoryByKeyword(name?: string): Promise<[Category[], number] | undefined>{
        const category = await this.categoryRepository.findAndCount({where: {name: Like('%' + name + '%')}});
        if(!category)
            throw new NotFoundException('Category not found !');
        return category;
    }

    async findCategoryByName(options: object): Promise<Category| any>{
        const category = await this.categoryRepository.findAndCount({where: {name: Like('%' + options['name'] + '%')}});
        console.log(options['name']);
        return category;
    }

    async getPostCategories(postId: number): Promise<[Category[], number]| any>{
        return await this.categoryRepository.findAndCount({where: {posts: {id: postId}}});
    }

    async updateCategory(id: number, updateCategory: CategoryDto): Promise<any>{
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
