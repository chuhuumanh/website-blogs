import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";
import { Users } from "src/user/users";
import { Posts } from "src/post/posts";
import { Actions } from "src/action/actions";

@Entity()
export class Activity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    activedDate: string;

    @Column({nullable: true})
    comment: string;

    @ManyToOne(() => Users, (user) => user.activities)
    user: Users

    @ManyToOne(() => Posts, (post) => post.activities)
    post: Posts

    @ManyToOne(() => Actions, (action) => action.activities)
    action: Actions
}