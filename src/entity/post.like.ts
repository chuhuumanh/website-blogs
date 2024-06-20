import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Users } from "./users";
import { Posts } from "./posts";

@Entity()
export class PostLike{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    likedDate: string;

    @ManyToOne(() => Users, (user) => user.likedPosts)
    user: Users

    @ManyToOne(() => Posts, (post) => post.likedPosts)
    post: Posts
}