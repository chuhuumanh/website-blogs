import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TokenBlackList{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 1000})
    token: string
}