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

export const Config = {
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'dungpv04',
    password: 'Dung200409',
    database: 'WebBlog',
    entities: [Access, Actions, Activity, Category, 
        Comments, Friends, Images, Notifications, 
        Posts, Roles, Tags, Users],
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    synchronize: true
}