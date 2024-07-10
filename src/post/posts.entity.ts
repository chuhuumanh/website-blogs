import { Access } from "src/access/access.entity";
import { Activity } from "src/activity/activity.entity";
import { Category } from "src/category/category.entity";
import { Images } from "src/image/images.entity";
import { Notifications } from "src/notification/notifications.entity";
import { Tags } from "src/tag/tags.entity";
import { Users } from "src/user/users.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    @OneToMany(() => Notifications, (notification) => notification.post)
    notifications: Notifications[];

    @OneToMany(() => Activity, (activity) => activity.post)
    activities: Activity[]

    @ManyToOne(() => Access, (access) => access.posts)
    access: Access

    @ManyToOne(() => Users, (user) => user.posts)
    user: Users

    @ManyToMany(() => Category, (category) => category.posts)
    @JoinTable({name: 'PostCategory'})
    categories?: Category[]

    @OneToMany(() => Images, (image) => image.post)
    images?: Images[]

    @ManyToMany(() => Tags, (tag) => tag.posts)
    @JoinTable({name: 'PostTag'})
    tags?: Tags[]
}