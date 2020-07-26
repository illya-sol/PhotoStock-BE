import { v4 } from 'uuid'
import { redis } from '../redis'

export const createConfirmationUrl = async (userid: number) => {
    const tokenId = v4()
    redis.set(tokenId, userid, "ex", 60 * 60 * 24) // 1 day exp

    return `http://localhost:3000/user/confirm/${tokenId}`
}