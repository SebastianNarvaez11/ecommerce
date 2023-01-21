import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database'
import { OrderModel, ProductModel, UserModel } from '../../models'

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    try {
        await db.connect()

        await OrderModel.deleteMany()

        await UserModel.deleteMany()
        await UserModel.insertMany(seedDatabase.initialData.users)

        await ProductModel.deleteMany()
        await ProductModel.insertMany(seedDatabase.initialData.products)

        await db.disconnect()
    
        res.status(200).json({ message: 'Datos semilla insertados correctamente' })

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Ocurrio un error' })
    }
}  