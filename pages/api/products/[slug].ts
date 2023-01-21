import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { ProductModel } from '../../../models'
import { IProduct } from '../../../interfaces'

type Data =
    | { message: string }
    | IProduct

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const { slug } = req.query

    try {
        await db.connect()
        const product = await ProductModel.findOne({ slug }).lean()
        await db.disconnect()

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });

        return res.status(200).json(product)

    } catch (error) {
        await db.disconnect()
        console.log(error);
        return res.status(500).json({ message: 'Ocurrio un error al obtener el producto' })
    }

    res.status(200).json({ message: 'Example' })
}