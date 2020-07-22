import { ObjectType, Field, ID, Resolver, Query } from 'type-graphql'

@ObjectType()
export class User{
    @Field(type => ID)
    userid!: string

    @Field()
    username!: string

    @Field()
    password!: string

    @Field()
    email!: string
}

@Resolver()
export class UserResolver{
    @Query(returns => String)
    async gethello(){
        return await "hello-wrld";
    } 
}