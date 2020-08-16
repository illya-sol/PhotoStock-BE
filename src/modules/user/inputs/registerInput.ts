import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { passwordInput } from "../../shared/passwordInput";
import { IsEmailAlreadyExist, IsUserAlreadyExist } from '../userValidators';

@InputType()
export class RegisterInput extends passwordInput {
    @Field()
    @IsUserAlreadyExist({ message: "username already in use" })
	@MinLength(5)
	@MaxLength(30)
    username!: string

    @Field()
    @IsEmail()
    @IsEmailAlreadyExist({ message: "email already in use" })
    email!: string;
}