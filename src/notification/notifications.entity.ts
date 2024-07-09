import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Actions } from "src/action/actions.entity";
import { Posts } from "src/post/posts.entity";
import { Users } from "src/user/users.entity";

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