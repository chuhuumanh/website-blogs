import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Posts } from "src/post/posts";
import { Users } from "src/user/users";
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

    @ManyToOne(() => Users, (user) => user.images)
    user: Users

}