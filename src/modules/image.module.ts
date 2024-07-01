import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from 'src/controllers/image.controller';
import { Category } from 'src/entity/category';
import { Images } from 'src/entity/images';
import { Posts } from 'src/entity/posts';
import { Tags } from 'src/entity/tags';
import { Users } from 'src/entity/users';
import { CategoryService } from 'src/services/category.service';
import { DatetimeService } from 'src/services/datetime.service';
import { ImageService } from 'src/services/image.service';
import { PostService } from 'src/services/post.service';
import { TagService } from 'src/services/tag.service';
import { UserService } from 'src/services/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([Images, Posts, Category, Tags, Users])],
    providers: [ImageService, DatetimeService, PostService, CategoryService, TagService, UserService],
    controllers: [ImageController]
})
export class ImageModule {}