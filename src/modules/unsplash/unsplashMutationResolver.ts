import { Arg, Query, Resolver } from "type-graphql";
import Unsplash, { toJson } from 'unsplash-js';
import { env } from '../../env.config';
import { unsplashInput } from './inputs/unsplashInput';
import { unsplashOutput } from './inputs/unsplashOutput';

global.fetch = require('node-fetch')

const unsplash = new Unsplash({
    accessKey: env.uAccess,
    secret: env.uSecret
})

@Resolver()
export class PhotoListResolver {
    @Query(() => [unsplashOutput], { nullable: true })
    async photoList(
        @Arg("data") { page, perPage, orderBy }: unsplashInput
    ): Promise<[unsplashOutput] | null> {
        return new Promise((res, rej) => {
            unsplash.photos.listPhotos(page, perPage, orderBy).then(toJson).then(json => {
                res(json as [unsplashOutput])
            }).then(err => {
                rej(err)
            })
        })
    }
}

export const unsplashMutationResolvers = [PhotoListResolver] as const