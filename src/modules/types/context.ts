import { Request, Response } from 'express';

export interface reqContext {
    req: Request
    res: Response
}