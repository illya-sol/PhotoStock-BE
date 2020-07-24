import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist, IsUserAlreadyExist } from './validate';

@InputType()
export class RegisterInput {
    @Field()
    @Length(4, 30)
    @IsUserAlreadyExist({ message: "username aready in use" })
    username!: string

    @Field()
    password!: string

    @Field()
    @IsEmail()
    @IsEmailAlreadyExist({ message: "email aready in use" })
    email!: string;
}