import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Actions } from "src/action/actions";
import { Posts } from "src/post/posts";
import { Users } from "src/user/users";

@Entity()
export class Notifications{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    activedDate: Date;

    @Column()
    isSeen: boolean;

    @Column()
    receiverId: number

    @ManyToOne(() => Actions, (action) => action.notifications)
    action: Actions;

    @ManyToOne(() => Posts, (post) => post.notifications)
    post: Posts
    
    @ManyToOne(() => Users, (user) => user.notifications)
    user: Users;
}