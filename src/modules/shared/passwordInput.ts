import { MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class passwordInput {
    @Field()
    @MinLength(5)
    password: string
}