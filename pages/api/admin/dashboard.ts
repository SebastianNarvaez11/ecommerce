import type { NextApiRequest, NextApiResponse } from 'next'
import { OrderModel, ProductModel, UserModel } from '../../../models';
import { db } from '../../../database';

type Data = {
    numberOfOrders: number;
    paidOrders: number; // isPad true
    notPaidOrders: number;
    numberOfClients: number; // role: client
    numberOfProducts: number;
    productsWithNoInventory: number; // 0
    lowInventory: number; // productos con 10 o menos
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    await db.connect();

    // const numberOfOrders = await Order.count();
    // const paidOrders = await Order.find({ isPaid: true }).count();
    // const numberOfClients = await User.find({ role: 'client' }).count();
    // const numberOfProducts = await Product.count();
    // const productsWithNoInventory = await Product.find({ inStock: 0 }).count();
    // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count();


    // el promise all hace todas las consultas al mismo tiempo
    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
        OrderModel.count(),
        OrderModel.find({ isPaid: true }).count(),
        UserModel.find({ role: 'client' }).count(),
        ProductModel.count(),
        ProductModel.find({ inStock: 0 }).count(),
        ProductModel.find({ inStock: { $lte: 10 } }).count(),
    ]);


    await db.disconnect();

    res.status(200).json({
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders: numberOfOrders - paidOrders
    })
}