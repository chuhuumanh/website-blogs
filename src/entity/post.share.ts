import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Users } from "./users";
import { Posts } from "./posts";

@Entity()
export class PostShare{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sharedDate: string;

    @ManyToOne(() => Users, (user) => user.sharedPosts)
    user: Users

    @ManyToOne(() => Posts, (post) => post.sharedPosts)
    post: Posts
}