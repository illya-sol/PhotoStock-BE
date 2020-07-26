import bcrypt from 'bcryptjs'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { User } from '../../entity/users'
import { redis } from '../../redis'
import { createConfirmationUrl } from '../../utils/generateConfirmationUrl'
import { sendEmail } from '../../utils/sendEmail'
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

        await sendEmail(email, await createConfirmationUrl(user.id))

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
        const userid = await redis.get(token);

        if (!userid)
            return false
        await User.update({ id: userid as any }, { confirmed: true })
        await redis.del(token)

        return true
    }
}

export const resolvers = [UserResolver, ConfirmUserResolver, LoginResolver, RegisterResolver] as const