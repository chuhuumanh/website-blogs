import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Posts } from "./posts";
import { Users } from "./users";

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

    @ManyToOne(() => Posts, (post) => post.images)
    post: Posts

}