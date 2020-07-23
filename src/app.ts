import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { UserResolver } from './modules/user/register';

const main = async () => {
    await createConnection();
    const schema = await buildSchema({ resolvers: [UserResolver] });

    const env = require('./env.conf')
    const apolloServer = new ApolloServer({ schema })
    const app = Express()

    apolloServer.applyMiddleware({ app })
    app.listen(env.port, (err: string) => {
        if (err)
            console.log(err)
        console.log('Express apollo server started at port ' + env.port)
    })
}

main()