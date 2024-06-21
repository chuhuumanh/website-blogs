import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany} from "typeorm";
import { Users } from "./users";

@Entity()
export class Friends{
    @PrimaryGeneratedColumn()
    friendId: number;

    @Column({nullable: true})
    addedDate?: Date;

    @Column({nullable: true})
    isAccept: boolean;

    @OneToMany(() => Users, (user) => user.friend)
    currentUsers?: Users[]
}