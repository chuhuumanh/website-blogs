import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { Notifications } from "src/notification/notifications";
import { Activity } from "src/activity/activity";
@Entity()
export class Actions{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Notifications, (notification) => notification.action)
    notifications: Notifications[];

    @OneToMany(() => Activity, (activity) => activity.action)
    activities: Activity[]
}