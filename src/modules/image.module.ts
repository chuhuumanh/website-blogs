import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entity/category';
import { Images } from 'src/entity/images';
import { Posts } from 'src/entity/posts';
import { Tags } from 'src/entity/tags';
import { CategoryService } from 'src/services/category.service';
import { DatetimeService } from 'src/services/datetime.service';
import { ImageService } from 'src/services/image.service';
import { PostService } from 'src/services/post.service';
import { TagService } from 'src/services/tag.service';

@Module({
    imports: [TypeOrmModule.forFeature([Images, Posts, Category, Tags])],
    providers: [ImageService, DatetimeService, PostService, CategoryService, TagService],
})
export class ImageModule {}
