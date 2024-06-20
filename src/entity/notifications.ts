import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import { Actions } from "./actions";
import { Posts } from "./posts";
import { Users } from "./users";

@Entity()
export class Notifications{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    activedDate: Date;

    @Column()
    isSeen: boolean;

    @ManyToOne(() => Actions, (action) => action.notifications)
    action: Actions;

    @ManyToOne(() => Posts, (post) => post.notifications)
    post: Posts
    
    @ManyToOne(() => Users, (user) => user.notifications)
    user: Users;
}