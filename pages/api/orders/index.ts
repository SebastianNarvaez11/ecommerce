import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouteLoader } from 'next/dist/client/route-loader';
import { NextRequest } from 'next/server';
import { IOrder } from '../../../interfaces';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { OrderModel, ProductModel } from '../../../models';

type Data =
    | { message: string }
    | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return createOrder(req, res)

        default:
            res.status(400).json({ message: 'Bad Request' })
            break;
    }

}


const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { orderItems, total } = req.body as IOrder;
    console.log(req.body);

    // Vericar que tengamos un usuario
    const session: any = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' });
    }

    // Crear un arreglo con los id de los productos que la persona envio n el carrito
    const productsIds = orderItems.map(product => product._id);
    await db.connect();

    const dbProducts = await ProductModel.find({ _id: { $in: productsIds } });

    try {

        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find(prod => prod.id === current._id)?.price;
            if (!currentPrice) {
                throw new Error('Verifique el carrito de nuevo, producto no existe');
            }

            return (currentPrice * current.quantity) + prev
        }, 0);


        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * (taxRate + 1);

        if (total !== backendTotal) {
            throw new Error('El total no cuadra con el monto');
        }

        // Todo bien hasta este punto
        const userId = session.user.id;
        console.log(session.user);

        const newOrder = new OrderModel({ ...req.body, isPaid: false, user: userId });
        newOrder.total = Math.round(newOrder.total * 100) / 100 //redondear el total
        await newOrder.save();
        await db.disconnect();

        return res.status(201).json(newOrder);


    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        return res.status(400).json({ message: error.message || 'Revise logs del servidor' })
    }
}