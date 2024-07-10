import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import { Notifications } from "src/notification/notifications.entity";
import { Posts } from "src/post/posts.entity";
import { Activity } from "src/activity/activity.entity";
import { Roles } from "src/role/roles.entity";
import { Friends } from "src/friend/friends.entity";
@Entity()
export class Users{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;
    
    @Column({select: false})
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

    @OneToMany(() => Activity, (activity) => activity.user)
    activities: Activity[];

    @ManyToOne(() => Roles, (role) => role.users)
    role: Roles;

    @OneToMany(() => Friends, (friend) => friend.userSentRequest)
    friends: Friends[]

    @OneToMany(() => Posts, (post) => post.user)
    posts: Posts[]

}