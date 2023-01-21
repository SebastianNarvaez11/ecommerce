import type { NextApiRequest, NextApiResponse } from 'next'
import { SHOP_CONSTANTS, db } from '../../../database'
import { ProductModel } from '../../../models'
import { IProduct } from '../../../interfaces'

type Data =
    | { message: string }
    | IProduct[]



export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res)

        default:
            return res.status(200).json({ message: 'Bad request' })
    }
}



const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { gender = 'all' } = req.query

    // here we are checking that the gender is a valid gender and we create a condition to pass it to the query
    let condition = {}

    if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
        condition = { gender }
    }

    try {
        await db.connect()

        const products = await ProductModel.find(condition)
            .select('title images price inStock slug -_id')
            .lean()

        await db.disconnect()

        const updatedProducts = products.map(product => {
            product.images = product.images.map(image => {
                return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
            });
    
            return product;
        })

        return res.status(200).json(updatedProducts)

    } catch (error) {
        await db.disconnect()
        console.log(error);
        return res.status(500).json({ message: 'Ocurrio un error al obtener los productos' })
    }
}