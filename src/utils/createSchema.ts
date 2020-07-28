import { buildSchema } from "type-graphql"
import { userauthChecker } from "../modules/auth/auth"
import { mutationResolvers } from '../modules/user/userMutationResolvers'

export const createSchema = () => {
    console.log("after")
    return buildSchema({
        resolvers: mutationResolvers,
        authChecker: userauthChecker
    })
}