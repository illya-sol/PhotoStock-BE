import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    userid!: string

    @Column("text", {unique: true})
    username!: string

    @Column()
    password!: string

    @Column("text", {unique: true})
    email!: string
}