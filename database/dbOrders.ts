import { isValidObjectId } from "mongoose";
import { IOrder } from "../interfaces";
import { db } from ".";
import { OrderModel } from "../models";

export const getOrderById = async (id: string): Promise<IOrder | null> => {

    if (!isValidObjectId(id)) {
        return null
    }

    await db.connect()
    const order = await OrderModel.findById(id)
    await db.disconnect()


    if (!order) {
        return null
    }

    return JSON.parse(JSON.stringify(order))
}


export const getOrdersByUser = async( userId: string ): Promise<IOrder[]> => {
    
    if ( !isValidObjectId(userId) ){
        return [];
    }

    await db.connect();
    const orders = await OrderModel.find({ user: userId }).lean();
    await db.disconnect();


    return JSON.parse(JSON.stringify(orders));
}