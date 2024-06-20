import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany} from "typeorm";
import { Access } from "./access";
import { Category } from "./category";
import { Images } from "./images";
import { Tags } from "./tags";
import { Notifications } from "./notifications";
import { Comments } from "./comments";
import { Activity } from "./activity";

@Entity()
export class Posts{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    likedCount: number;

    @Column()
    sharedCount: number;

    @Column()
    publishedDate: Date;

    @Column()
    commentCount: number;

    @Column()
    savedCount: number;

    @Column()
    imagePath: string;

    @OneToMany(() => Notifications, (notification) => notification.post)
    notifications: Notifications[];

    @OneToMany(() => Activity, (activity) => activity.post)
    activities: Activity[]

    @OneToMany(() => Comments, (comment) => comment.post)
    comments: Comments[]

    @ManyToOne(() => Access, (access) => access.posts)
    access: Access

    @ManyToMany(() => Category, (category) => category.posts)
    @JoinTable({name: 'PostCategory'})
    categories?: Category[]

    @ManyToMany(() => Images, (image) => image.posts)
    @JoinTable({name: 'PostImage'})
    images?: Images[]

    @ManyToMany(() => Tags, (tag) => tag.posts)
    @JoinTable({name: 'PostTag'})
    tags?: Tags[]
}