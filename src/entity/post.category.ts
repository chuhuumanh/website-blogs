import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";

@Entity()
export class PostCategory{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyT
    name: string;
}