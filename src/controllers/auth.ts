import { Request, Response } from "express";
import { prismaClient } from "..";
import {compareSync, hashSync} from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";

export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    let user = await prismaClient.user.findFirst(
        {
            where: {
                email: email
            }
        }
    )

    if(user) {
        throw new Error('User already exists!');
    }

    user = await prismaClient.user.create(
        {
            data: {
                name,
                email,
                password: hashSync(password,10)
            }
        }
    )

    res.json(user);
}


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst(
        {
            where: {
                email: email
            }
        }
    )

    if(!user) {
        throw new Error('User does not exists!');
    }

    if(!compareSync(password, user.password)){
        throw Error ('Incorrect password!');
    }

    const token = jwt.sign({
        userId: user.id
    },JWT_SECRET)

    res.json({user,token});
}