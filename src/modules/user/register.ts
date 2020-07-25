import bcrypt from 'bcryptjs';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { User } from '../../entity/users';
import { RegisterInput } from './register/registerinput';

@Resolver()
export class RegisterResolver {

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

        return user
    }
}