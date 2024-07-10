import { Actions } from "src/action/actions.entity";
import { Posts } from "src/post/posts.entity";
import { Users } from "src/user/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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