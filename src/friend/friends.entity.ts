import { Users } from "src/user/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Friends{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userReceiveRequestId: number;

    @Column({nullable: true})
    addedDate?: Date;

    @Column({nullable: true})
    isAccept: boolean;

    @ManyToOne(() => Users, (user) => user.friends)
    userSentRequest: Users
}