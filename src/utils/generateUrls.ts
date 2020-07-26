import { v4 } from 'uuid'
import { confirmPrefix, forgotPasswordPrefix } from '../modules/constants/redisPrefixes'
import { redis } from '../redis'

export const createConfirmationUrl = async (userid: number) => {
    const tokenId = v4()
    redis.set(confirmPrefix + tokenId, userid, "ex", 60 * 60 * 24) // 1 day exp

    return `http://localhost:3000/user/confirm/${tokenId}`
}

export const createForgotPasswordUrl = async (userid: number) => {
    const tokenId = v4()
    redis.set(forgotPasswordPrefix + tokenId, userid, "ex", 60 * 60) // 1 hour expire

    return `http://localhost:3000/user/change-password/${tokenId}`
}