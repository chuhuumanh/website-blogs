import { BadRequestException, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionModule } from 'src/action/action.module';
import { ActivityModule } from 'src/activity/activity.module';
import { CategoryModule } from 'src/category/category.module';
import { ImageModule } from 'src/image/image.module';
import { UserModule } from 'src/user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { Posts } from './posts';
import { PostService } from './post.service';
import { DatetimeService } from 'src/datetime/datetime.service';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from 'src/role/role.guard';
import { PostController } from './post.controller';
import { TagModule } from 'src/tag/tag.module';

@Module({
    imports: [TypeOrmModule.forFeature([Posts]),
                MulterModule.register({
                    dest: 'public/images',
                    fileFilter: (req, file, callback) => {
                        if (!file.mimetype.match(/^(image\/jpeg|image\/png|image\/gif|image\/bmp)$/i)) {
                        callback(new BadRequestException("Only jpeg, jpg, gif, bmp files are allow"), false);
                        }
                        else callback(null, true)
                    }
                } //
            ),
    forwardRef(() => ActivityModule) , forwardRef(() => ImageModule), CategoryModule, ActionModule, TagModule, forwardRef(() => UserModule)],
    providers: [PostService, DatetimeService, {provide:APP_GUARD, useClass: RoleGuard}],
    controllers: [PostController],
    exports: [PostService]
})
export class PostModule {}