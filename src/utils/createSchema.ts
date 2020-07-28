import { buildSchema } from "type-graphql"
import { userauthChecker } from "../modules/auth/auth"
import { resolvers } from '../modules/user/userResolvers'

export const createSchema = () => {
    return buildSchema({
        resolvers: resolvers,
        authChecker: userauthChecker
    })
}