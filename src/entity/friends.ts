import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne} from "typeorm";
import { Users } from "./users";

@Entity()
export class Friends{
    @PrimaryGeneratedColumn()
    friendId: number;

    @Column({nullable: true})
    addedDate?: Date;

    @Column({nullable: true})
    isAccept: boolean;

    @ManyToOne(() => Users, (user) => user.friends)
    currentUser: Users
}