import { Field, InputType } from "type-graphql";
import { passwordInput } from "../../shared/passwordInput";

@InputType()
export class changePasswordInput extends passwordInput {
    @Field()
    token!: string
}