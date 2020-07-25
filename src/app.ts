import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import Express from 'express';
import session from 'express-session';
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { LoginResolver } from './modules/user/login';
import { RegisterResolver } from './modules/user/register';
import { UserResolver } from './modules/user/user';
import { redis } from './redis';

const main = async () => {
    await createConnection();

    const env = require('./env.conf')
    const schema = await buildSchema({ resolvers: [RegisterResolver, LoginResolver, UserResolver] })
    const apolloServer = new ApolloServer({
        schema,
        context: ({ req }) => ({ req })
    })
    const app = Express()
    const RedisStore = connectRedis(session)

    const sessionOption: session.SessionOptions = {
        store: new RedisStore({
            client: redis,
        }),
        name: "qid",
        secret: env.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: env.age,
        },
    };

    app.use(session(sessionOption))

    app.use(cors({
        credentials: true,
        origin: 'http://localhost:3000'
    }));

    //app.use before applying apollo-server middleware
    apolloServer.applyMiddleware({ app })
    app.listen(env.port, (err: string) => {
        if (err)
            console.log(err)
        console.log('Express apollo server started at port ' + env.port)
    })
}

main()