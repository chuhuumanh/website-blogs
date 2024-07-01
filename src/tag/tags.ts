import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import { Posts } from "src/post/posts";

@Entity()
export class Tags{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Posts, (post) => post.tags)
    posts: Posts[]
}