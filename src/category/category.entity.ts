import { Posts } from "src/post/posts.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
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