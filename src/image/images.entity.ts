import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Posts } from "src/post/posts.entity";
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

    @Column()
    mimetype: string

    @ManyToOne(() => Posts, (post) => post.images)
    post: Posts

}