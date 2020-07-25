import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column("text", { unique: true })
    username!: string

    @Field()
    @Column("text", { unique: true })
    email!: string

    @Column()
    password!: string

    @Column("bool", { default: false })
    confirmed!: boolean
}