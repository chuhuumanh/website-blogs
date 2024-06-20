import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { Notifications } from "./notifications";
import { Activity } from "./activity";

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