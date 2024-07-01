import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Users } from "src/user/users";
import { Posts } from "src/post/posts";
@Entity()
export class Comments{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    postedDate: Date

    @ManyToOne(() => Users, (user) => user.comments)
    user: Users

    @ManyToOne(() => Posts, (post) => post.comments)
    post: Posts
}