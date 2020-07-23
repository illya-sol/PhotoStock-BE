import crypto from 'crypto';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../../entity/users';
import { RegisterInput } from '../register/registerinput';

@Resolver()
export class UserResolver {
    @Query(() => String)
    async hello() {
        return await "hello-wrlddddd";
    }

    @Mutation(() => User)
    async register(
        @Arg("data") { username, email, password }: RegisterInput,
    ): Promise<User> {
        const salt: string = crypto.randomBytes(16).toString('base64')
        const hash: string = crypto.createHmac('sha512', salt).update(password).digest('base64')

        password = salt + '$' + hash

        const user = await User.create({
            username,
            password,
            email
        }).save()

        return user
    }
}