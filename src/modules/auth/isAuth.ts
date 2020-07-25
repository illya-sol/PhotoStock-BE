import { MiddlewareFn } from "type-graphql";
import { reqContext } from "../types/context";

export const isAuth: MiddlewareFn<reqContext> = async ({ context: { req } }, next) => {
    if (!req.session!.userId)
        throw new Error("user is not authorized");
    return next
}