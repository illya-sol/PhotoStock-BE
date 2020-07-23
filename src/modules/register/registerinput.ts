import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterInput {
    @Field()
    @Length(4, 30)
    username!: string

    @Field()
    password!: string

    @Field()
    @IsEmail()
    email!: string;
}