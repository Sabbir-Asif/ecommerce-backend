import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schema/users";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const signup = async (req: Request, res: Response, next: NextFunction) => {

    const parsed = SignUpSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new UnprocessableEntity(parsed.error,'Validation failed', ErrorCode.UNPROCESSABLE_ENTITY);
    }
    const { name, email, password } = req.body;

    let user = await prismaClient.user.findFirst(
        {
            where: {
                email: email
            }
        }
    )

    if (user) {
        throw new BadRequestException('User already exists!', ErrorCode.USER_ALREADY_EXISTS);
    } else {
        user = await prismaClient.user.create(
            {
                data: {
                    name,
                    email,
                    password: hashSync(password, 10)
                }
            }
        )

        res.status(201).json(user);
    }
}


export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst(
        {
            where: {
                email: email
            }
        }
    )

    if (!user) {
        throw new UnauthorizedException('User not found!', ErrorCode.USER_NOTFOUND);
    }

    if (!compareSync(password, user.password)) {
        throw new UnauthorizedException('Incorrect password!', ErrorCode.INCORRECT_PASSWORD);
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({ user, token });
}

export const me = async (req: Request, res: Response) => {
    if(req.headers.user) {
        const user = JSON.parse(req.headers.user as string);
        res.send(user);
    }
}