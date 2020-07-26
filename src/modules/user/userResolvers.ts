import bcrypt from 'bcryptjs'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { User } from '../../entity/users'
import { redis } from '../../redis'
import { createConfirmationUrl, createForgotPasswordUrl } from '../../utils/generateUrls'
import { sendEmail } from '../../utils/sendEmail'
import { confirmPrefix, forgotPasswordPrefix } from '../constants/redisPrefixes'
import { reqContext } from '../types/context'
import { RegisterInput } from './register/registerinput'

@Resolver()
class UserResolver {
    @Authorized()
    @Query(() => User, { nullable: true })
    async User(
        @Ctx() ctx: reqContext
    ): Promise<User | undefined> {
        return User.findOne(ctx.req.session!.userId)
    }
}

@Resolver()
class RegisterResolver {

    @Mutation(() => User)
    async register(
        @Arg("data") { username, email, password }: RegisterInput,
    ): Promise<User> {
        const hashPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username,
            password: hashPassword,
            email
        }).save()

        await sendEmail(email, true, await createConfirmationUrl(user.id))

        return user
    }
}

@Resolver()
class LoginResolver {

    @Mutation(() => User, { nullable: true })
    async login(
        @Arg("password") hashPassword: string,
        @Ctx() ctx: reqContext,
        @Arg("username", { nullable: true }) username?: string,
        @Arg("email", { nullable: true }) email?: string
    ): Promise<User | null> {

        let user

        if (username)
            user = await User.findOne({ where: { username } })
        else if (email)
            user = await User.findOne({ where: { email } })

        if (!user)
            return null

        const IsPasswordValid = await bcrypt.compare(hashPassword, user.password)

        if (!IsPasswordValid)
            return null

        if (!user.confirmed)
            return null;

        ctx.req.session!.userId = user.id

        return user
    }
}

@Resolver()
class ConfirmUserResolver {
    @Mutation(() => Boolean)
    async confirmUser(
        @Arg("token") token: string
    ): Promise<Boolean> {
        const userid = await redis.get(confirmPrefix + token);

        if (!userid)
            return false

        await User.update({ id: userid as any }, { confirmed: true })
        await redis.del(token)

        return true
    }
}

@Resolver()
class ForgotUserPasswordResolver {
    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string
    ): Promise<Boolean> {
        const user = await User.findOne({ where: { email } })

        if (!user)
            return true

        await sendEmail(user.email, false, await createForgotPasswordUrl(user.id))

        return true
    }
}

@Resolver()
class ChangePasswordResolver {
    @Mutation(() => User, { nullable: true })
    async resetPassword(
        @Arg("token") token: string,
        @Arg("password") password: string
    ): Promise<User | null> {
        const userId = await redis.get(forgotPasswordPrefix + token)

        if (!userId)
            return null

        const user = await User.findOne(userId)

        if (!user)
            return null

        await redis.del(token)

        user.password = await bcrypt.hash(password, 12)
        await user.save()

        return user
    }
}

export const resolvers = [UserResolver, ChangePasswordResolver, ForgotUserPasswordResolver, ConfirmUserResolver, LoginResolver, RegisterResolver] as const