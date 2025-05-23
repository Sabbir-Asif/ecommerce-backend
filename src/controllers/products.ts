import { Request, Response } from "express";
import { CreateProductSchema } from "../schema/products";
import { UnprocessableEntity } from "../exceptions/validation";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";

export const createProduct = async (req: Request, res: Response) => {

    const parsed = CreateProductSchema.safeParse(req.body);

    if(!parsed.success) {
        throw new UnprocessableEntity(parsed.error,'Validation failed!', ErrorCode.UNPROCESSABLE_ENTITY);
    }

    const tags = req.body.tags.join(',');

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: tags
        }
    })

    res.json(product);
}