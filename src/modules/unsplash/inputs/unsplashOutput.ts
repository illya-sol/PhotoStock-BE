import { Field, Int, ObjectType } from "type-graphql";
import { unsplashUser } from "./unsplashUser";

@ObjectType()
class urlTypes {
    @Field()
    raw!: string

    @Field()
    full!: string

    @Field()
    regular!: string

    @Field()
    small!: string

    @Field()
    thumb!: string
}

@ObjectType()
export class unsplashOutput {
    @Field()
    id!: string

    @Field(() => Int)
    width!: number

    @Field(() => Int)
    height!: number

    @Field()
    description!: string

    @Field()
    alt_description!: string

    @Field()
    urls!: urlTypes

    @Field(() => Int)
    likes!: number

    @Field()
    user!: unsplashUser

}