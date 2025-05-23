import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";



export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    /**
 * 1. extract the token from header
 * 2. if the token not present, send unauthorized error
 * 3. if the token is present, verify the token and extract the payload
 * 4. get user form the payload
 * 5. attach the user to the current user request object
 */
    const token = req.headers.authorization;

    if (!token) {
        throw new UnauthorizedException('Token not found', ErrorCode.UNAUTHORIZED);
    }

    try {

        const payload = jwt.verify(token, JWT_SECRET) as any;
        const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });

        if (user === null) {
            next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
        }

        req.headers.user = JSON.stringify(user);
        next();

    } catch (err) {
        throw new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED);
    }
}
