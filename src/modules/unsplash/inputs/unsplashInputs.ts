import { Field, InputType, Int } from "type-graphql";

@InputType()
export class unsplashInput {
    @Field(() => Int)
    page!: number

    @Field(() => Int)
    perPage!: number

    @Field({ nullable: true })
    orderBy?: string
}

@InputType()
export class unsplashSearchInput {
    @Field()
    keyword!: string

    @Field(() => Int)
    page!: number

    @Field(() => Int)
    perPage!: number
}