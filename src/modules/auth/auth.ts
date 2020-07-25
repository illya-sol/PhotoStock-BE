import { AuthChecker } from "type-graphql";
import { reqContext } from "../types/context";

export const userauthChecker: AuthChecker<reqContext> = ({ context: { req } }) => {
    return !!req.session!.userId
}