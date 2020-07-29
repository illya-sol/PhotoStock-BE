import { buildSchema } from "type-graphql"
import { userauthChecker } from "../modules/auth/auth"
import { unsplashMutationResolvers } from '../modules/unsplash/unsplashMutationResolver'
import { userMutationResolvers } from '../modules/user/userMutationResolvers'

export const createSchema = () => {
    return buildSchema({
        resolvers: [...userMutationResolvers, ...unsplashMutationResolvers],
        authChecker: userauthChecker
    })
}