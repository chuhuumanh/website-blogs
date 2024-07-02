import { Module, BadRequestException, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityModule } from 'src/activity/activity.module';
import { CategoryModule } from 'src/category/category.module';
import { FriendModule } from 'src/friend/friend.module';
import { ImageModule } from 'src/image/image.module';
import { NotificationModule } from 'src/notification/notification.module';
import { PostModule } from 'src/post/post.module';
import { TagModule } from 'src/tag/tag.module';
import { Users } from './users';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DatetimeService } from 'src/datetime/datetime.service';
import { UserService } from './user.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
import { UserController } from './user.controller';
@Module({
    imports: [TypeOrmModule.forFeature([Users]), MulterModule.register({
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/^(image\/jpeg|image\/png|image\/gif|image\/bmp)$/i)) {
                callback(new BadRequestException("Only jpeg, jpg, gif, bmp files are allow"), false);
            }
            else callback(null, true)
        },
        storage: diskStorage({
            destination: 'public/images',
            filename: (req, file, cb) =>{
                const encodeName = Date.now();
                const fileName = `${encodeName}.${file.mimetype.split('/')[1]}`
                cb(null, fileName);
            }
        })
    }
), PostModule, CategoryModule, TagModule, forwardRef(() => ImageModule), ActivityModule, forwardRef(() => FriendModule) , NotificationModule],
    exports: [UserService],
    providers: [UserService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [UserController]
})
export class UserModule {}