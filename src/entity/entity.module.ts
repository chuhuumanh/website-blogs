import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './access';
import { Actions } from './actions';
import { Category } from './category';
import { Comments } from './comments';
import { Friends } from './friends';
import { Images } from './images';
import { Notifications } from './notifications';
import { PostLike } from './post.like';
import { PostSave } from './post.save';
import { PostShare } from './post.share';
import { Posts } from './posts';
import { Roles } from './roles';
import { Tags } from './tags';
import { Users } from './users';

@Module({
    imports: [TypeOrmModule.forFeature([Access, Actions, Category, Comments,
                                        Friends, Images, Notifications, PostLike,
                                        PostSave, PostShare, Posts, Roles,
                                        Tags, Users
    ])]
})
export class EntityModule {}
