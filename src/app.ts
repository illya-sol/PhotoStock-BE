import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import Express from 'express';
import session from 'express-session';
import { Redis } from 'ioredis';
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { UserResolver } from './modules/user/register';
import { redis } from './redis';

const main = async () => {
    await createConnection();

    const env = require('./env.conf')
    const schema = await buildSchema({ resolvers: [UserResolver] })
    const apolloServer = new ApolloServer({
        schema,
        context: ({ req }) => ({ req })
    })
    const app = Express()
    const RedisStore = connectRedis(session)

    const sessionOption: session.SessionOptions = {
        store: new RedisStore({
            client: redis as Redis,
        }),
        name: "qid",
        secret: env.secret,
        // resave: false,
        // saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: env.age,
        },
    };

    app.use(session(sessionOption))

    apolloServer.applyMiddleware({ app })
    app.listen(env.port, (err: string) => {
        if (err)
            console.log(err)
        console.log('Express apollo server started at port ' + env.port)
    })
}

main()