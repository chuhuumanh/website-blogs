import { Access } from "./access/access"
import { Actions } from "./action/actions"
import { Activity } from "./activity/activity"
import { Category } from "./category/category"
import { Notifications } from "./notification/notifications"
import { Comments } from "./activity/comments"
import { Friends } from "./friend/friends"
import { Images } from "./image/images"
import { Posts } from "./post/posts"
import { Roles } from "./role/roles"
import { Tags } from "./tag/tags"
import { Users } from "./user/users"
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