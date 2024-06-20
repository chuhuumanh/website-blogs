import { PrimaryGeneratedColumn, Column } from "typeorm";
export abstract class Activity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    activedDate: string;
}