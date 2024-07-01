import { BadRequestException, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from 'src/controllers/post.controller';
import { Posts } from 'src/entity/posts';
import { PostService } from 'src/services/post.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/role.guard';
import { DatetimeService } from 'src/services/datetime.service';
import { ActivityService } from 'src/services/activity.service';
import { Activity } from 'src/entity/activity';
import { Comments } from 'src/entity/comments';
import { ImageService } from 'src/services/image.service';
import { TagService } from 'src/services/tag.service';
import { CategoryService } from 'src/services/category.service';
import { Images } from 'src/entity/images';
import { Tags } from 'src/entity/tags';
import { Category } from 'src/entity/category';
import { MulterModule } from '@nestjs/platform-express';
import { ActionService } from 'src/services/action.service';
import { Actions } from 'src/entity/actions';
import { diskStorage, memoryStorage } from 'multer';
import { UserService } from 'src/services/user.service';
import { Users } from 'src/entity/users';

@Module({
    imports: [TypeOrmModule.forFeature([Posts, Comments, Activity, Images, Tags, Category, Actions, Category, Users]),
                MulterModule.register({
                    dest: 'images/postsImg/',
                    fileFilter: (req, file, callback) => {
                        if (!file.mimetype.match(/^(image\/jpeg|image\/png|image\/gif|image\/bmp)$/i)) {
                        callback(new BadRequestException("Only jpeg, jpg, gif, bmp files are allow"), false);
                        }
                        else callback(null, true)
                    }
                } //
            )
    ],
    providers: [PostService, DatetimeService, ActivityService, ImageService, 
                TagService, CategoryService, ImageService, ActionService, UserService,
                CategoryService, TagService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [PostController]
})
export class PostModule {}