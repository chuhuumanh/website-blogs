import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Users } from "./users";
import { Posts } from "./posts";
import { Activity } from "./activity";

@Entity()
export class PostShare extends Activity{

    @ManyToOne(() => Users, (user) => user.sharedPosts)
    user: Users

    @ManyToOne(() => Posts, (post) => post.sharedPosts)
    post: Posts
}