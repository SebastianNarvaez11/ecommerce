import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { tesloApi } from "../../api";
import { RootState } from "../store";
import { IOrder } from "../../interfaces";
import axios from "axios";
import { clean_cart } from "../slices/cartSlice";

interface IResponseOrder {
    hasError: boolean,
    message?: string
}


export const createOrder = (): ThunkAction<Promise<IResponseOrder>, RootState, unknown, AnyAction> => async (dispatch, getState): Promise<IResponseOrder> => {

    if (!getState().cart.shippingAddress) {
        throw new Error('No hay direccion de entrega')
    }

    const order: IOrder = {
        orderItems: getState().cart.cart.map(p => ({ ...p, size: p.size! })),
        shippingAddress: getState().cart.shippingAddress!,
        numberOfItems: getState().cart.numberOfItems,
        subTotal: getState().cart.subTotal,
        tax: getState().cart.tax,
        total: getState().cart.total,
        isPaid: false
    }

    try {
        const { data } = await tesloApi.post<IOrder>('/orders', order)

        dispatch(clean_cart())
        
        return {
            hasError: false,
            message: data._id
        }

    } catch (error) {
        if (axios.isAxiosError(error)){
            return {
                hasError: true,
                message: error.response?.data.message
            }
        }

        return {
            hasError: true,
            message: 'error no controlado, hable con el administrador'
        }
    }
}