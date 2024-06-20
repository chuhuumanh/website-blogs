import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Users } from "./users";
import { Posts } from "./posts";

@Entity()
export class PostSave{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    savedDate: string;

    @ManyToOne(() => Users, (user) => user.savedPosts)
    user: Users

    @ManyToOne(() => Posts, (post) => post.savedPosts)
    post: Posts
}