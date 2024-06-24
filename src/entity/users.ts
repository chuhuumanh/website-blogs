import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import { Roles } from "./roles";
import { Friends } from "./friends";
import { Notifications } from "./notifications";
import { Comments } from "./comments";
import { Activity } from "./activity";
import { Posts } from "./posts";

@Entity()
export class Users{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    phoneNum: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({nullable: true})
    dateOfBirth: Date

    @Column()
    email: string;

    @Column({nullable: true})
    bio: string;

    @Column({nullable: true})
    postPublishedCount: number;

    @Column()
    gender: boolean;

    @Column({nullable: true})
    friendCount: number;

    @Column({nullable: true})
    profilePicturePath: string;

    @OneToMany(() => Notifications, (notification) => notification.user)
    notifications: Notifications[]

    @OneToMany(() => Comments, (comment) => comment.post)
    comments: Comments[]

    @OneToMany(() => Activity, (activity) => activity.user)
    activities: Activity[];

    @ManyToOne(() => Roles, (role) => role.users)
    role: Roles;

    @OneToMany(() => Friends, (friend) => friend.currentUser)
    friends: Friends[]

    @OneToMany(() => Posts, (post) => post.user)
    posts: Posts[]
}