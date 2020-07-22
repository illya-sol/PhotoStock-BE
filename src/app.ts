import "reflect-metadata";
import Express from 'express'
import { buildSchema } from "type-graphql";
import { User, UserResolver } from './schema/schema'
import { ApolloServer, gql } from 'apollo-server-express'
import { createConnection } from "typeorm";

const main = async () => {
    await createConnection();
    const schema = await buildSchema({ resolvers: [UserResolver] });

    const env = require('./env.conf')
    const apolloServer = new ApolloServer({ schema })
    const app = Express()

    apolloServer.applyMiddleware({ app })
    app.listen(env.port, (err:string) => {
        if(err)
            console.log(err)
        console.log('Express apollo server started at port ' + env.port)
    })
}

main()