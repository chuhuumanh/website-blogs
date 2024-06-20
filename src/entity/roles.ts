import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany} from "typeorm";
import { Users } from "./users";

@Entity()
export class Roles{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Users, (user) => user.role)
    users: Users[]
}