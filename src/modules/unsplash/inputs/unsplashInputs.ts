import { Field, InputType } from "type-graphql";

@InputType()
export class unsplashInput {
    @Field()
    page!: number

    @Field()
    perPage!: number

    @Field()
    orderBy?: string
}

@InputType()
export class unsplashSearchInput {
    @Field()
    keyword!: string

    @Field()
    page!: number

    @Field()
    perPage!: number
}