import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import { Posts } from "./posts";

@Entity()
export class Images{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    imgPath: string;

    @Column()
    uploadedDate: Date;

    @Column()
    fileType: string;

    @Column()
    size: number;

    @ManyToMany(() => Posts, (post) => post.images)
    posts?: Posts[]
}