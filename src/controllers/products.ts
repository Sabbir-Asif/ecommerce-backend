import { Request, Response } from "express";
import { CreateProductSchema } from "../schema/products";
import { UnprocessableEntity } from "../exceptions/validation";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { NoContentException } from "../exceptions/no-content";

export const createProduct = async (req: Request, res: Response) => {

    const parsed = CreateProductSchema.safeParse(req.body);

    if (!parsed.success) {
        throw new UnprocessableEntity(parsed.error, 'Validation failed!', ErrorCode.UNPROCESSABLE_ENTITY);
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

export const updateProduct = async (req: Request, res: Response) => {
    try {

        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',');
        }

        const updatedProduct = await prismaClient.product.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: product
        })

        res.json(updatedProduct);

    } catch (err) {
        throw new NoContentException('Product not found!', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {

        const product = req.body;

        const deletedProduct = await prismaClient.product.delete({
            where: {
                id: parseInt(req.params.id)
            },
        })

        res.status(204).json(deletedProduct);

    } catch (err) {
        throw new NotFoundException('Product not found!', ErrorCode.PRODUCT_NOT_FOUND);
    }
}

export const listProducts = async (req: Request, res: Response) => {

    const count = await prismaClient.product.count();

    const skip = typeof req.query.skip === 'string' ? parseInt(req.query.skip) : 0;
    const take = typeof req.query.take === 'string' ? parseInt(req.query.take) : 10;

    const products = await prismaClient.product.findMany({
        skip,
        take
    })

    res.json({
        count,
        data: products
    })
}

export const getProductById = async (req: Request, res: Response) => {
    try{
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })

        res.json(product);
    } catch (err) {
        throw new NotFoundException('Product not found!', ErrorCode.PRODUCT_NOT_FOUND);
    }
}