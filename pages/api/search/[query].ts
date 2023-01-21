import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { ProductModel } from '../../../models'
import { IProduct } from '../../../interfaces'

type Data =
    | { message: string }
    | IProduct[]

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {

    let { query = '' } = req.query

    if (query.length === 0) {
        return res.status(400).json({ message: 'Debe especificar el query de busqueda' })
    }

    query = query.toString().toLowerCase()


    try {
        await db.connect()

        const products = await ProductModel.find({
            $text: { $search: query }   //se debe especificar un index en los campos del modelo 
        }).lean()

        await db.disconnect()

        return res.status(200).json(products)

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Ocurrio un error' })
    }
}