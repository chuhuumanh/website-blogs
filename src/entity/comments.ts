import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Users } from "./users";
import { Posts } from "./posts";

@Entity()
export class Comments{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string

    @Column()
    commentDate: string;

    @ManyToOne(() => Users, (user) => user.commentPosts)
    user: Users

    @ManyToOne(() => Posts, (post) => post.commentPosts)
    post: Posts
}