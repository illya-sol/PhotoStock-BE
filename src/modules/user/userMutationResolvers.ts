import bcrypt from 'bcryptjs'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { User } from '../../entity/users'
import { redis } from '../../redis'
import { createConfirmationUrl, createForgotPasswordUrl } from '../../utils/generateUrls'
import { sendFakeEmail } from '../../utils/sendEmail'
import { confirmPrefix, forgotPasswordPrefix } from '../constants/redisPrefixes'
import { reqContext } from '../types/context'
import { changePasswordInput } from './inputs/changePasswordInput'
import { LoginInput } from './inputs/loginInput'
import { RegisterInput } from './inputs/registerInput'

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

        await sendFakeEmail(email, true, await createConfirmationUrl(user.id))

        return user
    }
}

@Resolver()
class LoginResolver {

    @Mutation(() => User, { nullable: true })
    async login(
        @Arg("data") { username, email, password }: LoginInput,
        @Ctx() ctx: reqContext,
    ): Promise<User | null> {
        let user

        if (username)
            user = await User.findOne({ where: { username } })
        else if (email)
            user = await User.findOne({ where: { email } })

        if (!user)
            return null

        const IsPasswordValid = await bcrypt.compare(password, user.password)

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

        await sendFakeEmail(user.email, false, await createForgotPasswordUrl(user.id))

        return true
    }
}

@Resolver()
class ChangePasswordResolver {
    @Mutation(() => User, { nullable: true })
    async resetPassword(
        @Arg("data") { token, password }: changePasswordInput,
        @Ctx() ctx: reqContext
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

        ctx.req.session!.userId = user.id

        return user
    }
}

@Resolver()
export class LogoutResolver {
    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: reqContext): Promise<Boolean> {
        return new Promise((res, rej) => {
            ctx.req.session!.destroy((err) => {
                if (err) {
                    console.log(err)
                    return rej(false)
                }
                ctx.res.clearCookie('qid')
                return res(true)
            })
        })
    }
}

export const mutationResolvers = [LogoutResolver, ChangePasswordResolver, ForgotUserPasswordResolver, ConfirmUserResolver, LoginResolver, RegisterResolver] as const