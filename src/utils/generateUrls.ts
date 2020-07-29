import { v4 } from 'uuid'
import { env } from '../env.config'
import { confirmPrefix, forgotPasswordPrefix } from '../modules/constants/redisPrefixes'
import { redis } from '../redis'

export const createConfirmationUrl = async (userid: number) => {
    const tokenId = v4()
    redis.set(confirmPrefix + tokenId, userid, "ex", 60 * 60 * 24) // 1 day exp

    return env.FrontEndUrl + `/user/confirm/${tokenId}`
}

export const createForgotPasswordUrl = async (userid: number) => {
    const tokenId = v4()
    redis.set(forgotPasswordPrefix + tokenId, userid, "ex", 60 * 60) // 1 hour expire

    return env.FrontEndUrl + `/user/change-password/${tokenId}`
}