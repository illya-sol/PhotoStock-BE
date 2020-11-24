import { ApolloServer } from 'apollo-server-express'
import connectRedis from 'connect-redis'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import queryComplexity, { fieldExtensionsEstimator, simpleEstimator } from 'graphql-query-complexity'
import "reflect-metadata"
import { createConnection } from "typeorm"
import { env } from './env.config'
import { redis } from './redis'
import { createSchema } from './utils/createSchema'

const main = async () => {
    await createConnection()

    const schema = await createSchema()
    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
        validationRules: [
            queryComplexity({
                maximumComplexity: 22,
                estimators: [
                    fieldExtensionsEstimator(),
                    simpleEstimator({
                        defaultComplexity: 1
                    })
                ]
            })
        ]
    })
    const app = express()
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
    }

    app.use(session(sessionOption))

    app.use(cors({
        credentials: true,
        origin: env.FrontEndUrl
    }))

    //app.use before applying apollo-server middleware
    apolloServer.applyMiddleware({ app })
    app.listen(env.port, () => {
        console.log('Express apollo server started at port ' + env.port)
    })
}

main()

ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС 
ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС 
ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС 
ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС 
ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС ЛАТЫШ ПИДОРАС 
