import { Field, InputType } from "type-graphql";
import { passwordInput } from "../../shared/passwordInput";
import { reqContext } from "../../types/context";

@InputType()
export class changePasswordInput extends passwordInput {
    @Field()
    token!: string
    @Field()
    ctx: reqContext
}