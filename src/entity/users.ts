import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import { Roles } from "./roles";
import { Friends } from "./friends";
import { Notifications } from "./notifications";
import { Comments } from "./comments";
import { Activity } from "./activity";

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
    fistName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    bio: string;

    @Column()
    postPublishedCount: number;

    @Column()
    gender: boolean;

    @Column()
    friendCount: number;

    @Column()
    profilePicturePath: string;

    @OneToMany(() => Notifications, (notification) => notification.user)
    notifications: Notifications[]

    @OneToMany(() => Comments, (comment) => comment.post)
    comments: Comments[]

    @OneToMany(() => Activity, (activity) => activity.user)
    activities: Activity[];

    @ManyToOne(() => Roles, (role) => role.users)
    role: Roles;

    @ManyToOne(() => Friends, (friend) => friend.currentUsers)
    friend: Friends

}