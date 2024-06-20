import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany} from "typeorm";
import { Posts } from "./posts";

@Entity()
export class Access{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Posts, (post) => post.access)
    posts: Posts[]
}