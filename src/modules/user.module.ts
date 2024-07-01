import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/users';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/auth/role.guard';
import { PostService } from 'src/services/post.service';
import { Posts } from 'src/entity/posts';
import { DatetimeService } from 'src/services/datetime.service';
import { CategoryService } from 'src/services/category.service';
import { Category } from 'src/entity/category';
import { Tags } from 'src/entity/tags';
import { TagService } from 'src/services/tag.service';
import { BadRequestException } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Images } from 'src/entity/images';
import { ImageService } from 'src/services/image.service';
import { Activity } from 'src/entity/activity';
import { ActivityService } from 'src/services/activity.service';
import { Comments } from 'src/entity/comments';
import { Friends } from 'src/entity/friends';
import { FriendService } from 'src/services/friend.service';
import { Notifications } from 'src/entity/notifications';
import { NotificationService } from 'src/services/notification.service';

@Module({
    imports: [TypeOrmModule.forFeature([Users, Posts, Category, Tags, Images, Activity, Comments, Friends, Notifications]), MulterModule.register({
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/^(image\/jpeg|image\/png|image\/gif|image\/bmp)$/i)) {
                callback(new BadRequestException("Only jpeg, jpg, gif, bmp files are allow"), false);
            }
            else callback(null, true)
        },
        storage: diskStorage({
            destination: 'images/usersImg',
            filename: (req, file, cb) =>{
                const encodeName = Date.now();
                const fileName = `${encodeName}.${file.mimetype.split('/')[1]}`
                cb(null, fileName);
            }
        })
    }
)],
    exports: [UserService],
    providers: [UserService, ImageService, ActivityService, PostService,
         DatetimeService, FriendService, CategoryService, TagService, NotificationService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [UserController]
})
export class UserModule {}