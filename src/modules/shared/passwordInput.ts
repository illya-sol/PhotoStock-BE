import { Max, Min } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class passwordInput {
    @Field()
    @Min(5)
    @Max(30)
    password: string
}