import { Field, ObjectType } from "type-graphql";

@ObjectType()
class ImageSizes {
    @Field()
    small: string

    @Field()
    medium: string

    @Field()
    large: string
}

@ObjectType()
export class unsplashUser {
    @Field()
    id!: string

    @Field()
    username!: string

    @Field()
    name!: string

    @Field()
    bio!: string

    @Field()
    location!: string

    @Field()
    profile_image!: ImageSizes

}