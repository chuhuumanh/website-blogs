import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import { Roles } from "./roles";
import { Friends } from "./friends";
import { Notifications } from "./notifications";
import { PostShare } from "./post.share";
import { PostLike } from "./post.like";
import { PostSave } from "./post.save";
import { Comments } from "./comments";

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

    @OneToMany(() => Comments, (commentPost) => commentPost.user)
    commentPosts: PostSave[];

    @OneToMany(() => PostLike, (savedPost) => savedPost.user)
    savedPosts: PostSave[];

    @OneToMany(() => PostLike, (likedPost) => likedPost.user)
    likedPosts: PostShare[];

    @OneToMany(() => PostShare, (sharedPost) => sharedPost.user)
    sharedPosts: PostShare[];

    @ManyToOne(() => Roles, (role) => role.users)
    role: Roles;

    @ManyToOne(() => Friends, (friend) => friend.currentUsers)
    friend: Friends

}