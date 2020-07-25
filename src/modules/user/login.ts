import bcrypt from 'bcryptjs';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/users';
import { reqContext } from '../types/context';

@Resolver()
export class LoginResolver {

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

        const IsPasswordValid = await bcrypt.compare(hashPassword, user.password);

        if (!IsPasswordValid)
            return null

        ctx.req.session!.userId = user.id;

        return user
    }
}