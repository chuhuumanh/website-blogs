import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Users } from "./users";
import { Posts } from "./posts";
import { Activity } from "./activity";

@Entity()
export class PostLike extends Activity{

    @ManyToOne(() => Users, (user) => user.likedPosts)
    user: Users

    @ManyToOne(() => Posts, (post) => post.likedPosts)
    post: Posts
}