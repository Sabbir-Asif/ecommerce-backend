import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { Address, User } from "@prisma/client";
import { prismaClient } from "..";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { NotFoundException } from "../exceptions/not-found";
import { BadRequestException } from "../exceptions/bad-request";

export const addAddress = async (req: Request, res: Response) => {

    const parsed = AddressSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new UnprocessableEntity(parsed.error, 'Bad request', ErrorCode.UNPROCESSABLE_ENTITY);
    }

    const user: User = JSON.parse(req.headers.user as string);

    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: user.id
        }
    })

    res.json(address);

}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: +req.params.id
            }
        })
        res.status(204).json({ success: true });
    } catch (err) {
        throw new NotFoundException('Address not found!', ErrorCode.ADDRESS_NOT_FOUND);
    }
}

export const listAddress = async (req: Request, res: Response) => {
    const user: User = JSON.parse(req.headers.user as string);
    const addresses = await prismaClient.address.findMany({
        where: {
            userId: user.id
        }
    })
    res.json(addresses);
}

export const updateUser = async (req: Request, res: Response) => {
    const parsed = UpdateUserSchema.safeParse(req.body);
    let shippingAddress: Address;
    let billingAddress: Address;
    const user: User = JSON.parse(req.headers.user as string);

    if (!parsed.success) {
        throw new UnprocessableEntity(parsed.error, 'Bad request!', ErrorCode.UNPROCESSABLE_ENTITY);
    } else {
        const reqData = parsed.data;
        if (reqData.defaultShipingAddress) {
            try {
                shippingAddress = await prismaClient.address.findFirstOrThrow({
                    where: {
                        id: reqData.defaultShipingAddress
                    }
                })

            } catch (err) {
                throw new NotFoundException('Address not found!', ErrorCode.ADDRESS_NOT_FOUND);
            }

            if (shippingAddress.userId !== user.id) {
                throw new BadRequestException('Address does not belog to the user', ErrorCode.ADDRESS_DOES_NOT_BELONG);
            }
        }

        if (reqData.defaultBillingAddress) {
            try {
                billingAddress = await prismaClient.address.findFirstOrThrow({
                    where: {
                        id: reqData.defaultBillingAddress
                    }
                })

            } catch (err) {
                throw new NotFoundException('Address not found!', ErrorCode.ADDRESS_NOT_FOUND);
            }

            if (billingAddress.userId !== user.id) {
                throw new BadRequestException('Address does not belog to the user', ErrorCode.ADDRESS_DOES_NOT_BELONG);
            }

        }

        const updatedUser = await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: reqData
        })

        res.status(200).json(updatedUser);
    }
}