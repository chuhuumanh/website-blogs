import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Users } from "./users";
import { Posts } from "./posts";
import { Activity } from "./activity";

@Entity()
export class PostSave extends Activity{

    @ManyToOne(() => Users, (user) => user.savedPosts)
    user: Users

    @ManyToOne(() => Posts, (post) => post.savedPosts)
    post: Posts
}