import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import { Posts } from "./posts";

@Entity()
export class Tags{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Posts, (post) => post.tags)
    posts: Posts[]
}