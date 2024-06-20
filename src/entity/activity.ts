import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import { Users } from "./users";
import { Posts } from "./posts";
import { Actions } from "./actions";

@Entity()
export class Activity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    activedDate: string;

    @ManyToOne(() => Users, (user) => user.activities)
    user: Users

    @ManyToOne(() => Posts, (post) => post.activities)
    post: Posts

    @ManyToOne(() => Actions, (action) => action.activities)
    action: Actions
}