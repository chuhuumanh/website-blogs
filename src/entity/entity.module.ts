import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './access';
import { Actions } from './actions';
import { Category } from './category';
import { Comments } from './comments';
import { Friends } from './friends';
import { Images } from './images';
import { Notifications } from './notifications';
import { Posts } from './posts';
import { Roles } from './roles';
import { Tags } from './tags';
import { Users } from './users';
import { Activity } from './activity';

@Module({
    imports: [TypeOrmModule.forFeature([Access, Actions, Activity, Category, 
                                        Comments, Friends, Images, Notifications, 
                                        Posts, Roles, Tags, Users
    ])]
})
export class EntityModule {}
