import { Ctx, Query, Resolver } from 'type-graphql';
import { User } from '../../entity/users';
import { reqContext } from '../types/context';

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async User(
        @Ctx() ctx: reqContext
    ): Promise<User | undefined> {
        if (!ctx.req.session!.userId)
            return undefined
        return User.findOne(ctx.req.session!.userId);
    }
}