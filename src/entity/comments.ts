import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Users } from "./users";
import { Posts } from "./posts";
import { Activity } from "./activity";

@Entity()
export class Comments extends Activity{

    @Column()
    commentDate: string;

    @ManyToOne(() => Users, (user) => user.commentPosts)
    user: Users

    @ManyToOne(() => Posts, (post) => post.commentPosts)
    post: Posts
}