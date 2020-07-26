import { Field, InputType } from "type-graphql";
import { passwordInput } from "../../shared/passwordInput";

@InputType()
export class LoginInput extends passwordInput {
    @Field({ nullable: true })
    username?: string

    @Field({ nullable: true })
    email?: string;
}