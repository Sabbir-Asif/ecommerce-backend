import { NextFunction, Request, Response } from "express"
import { ForbiddenException } from "../exceptions/forbidden";
import { ErrorCode } from "../exceptions/root";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = JSON.parse(req.headers.user as string);
    if(user.role === "ADMIN") {
        next();
    } else {
        next(new ForbiddenException('forbidden!', ErrorCode.FORBIDDEN))
    }
}