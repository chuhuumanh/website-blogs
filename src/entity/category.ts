import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import { Posts } from "./posts";

@Entity()
export class Category{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    descriptions: string

    @ManyToMany(() => Posts, (post) => post.categories)
    posts?: Posts[];
}