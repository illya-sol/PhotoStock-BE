import { IsEmail, Length } from "class-validator";
import { passwordInput } from "src/modules/shared/passwordInput";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist, IsUserAlreadyExist } from '../validate';

@InputType()
export class RegisterInput extends passwordInput {
    @Field()
    @Length(4, 30)
    @IsUserAlreadyExist({ message: "username already in use" })
    username!: string

    @Field()
    @IsEmail()
    @IsEmailAlreadyExist({ message: "email already in use" })
    email!: string;
}