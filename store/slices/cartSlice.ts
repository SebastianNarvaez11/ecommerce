import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ICartProduct, IOrderSummary, IShippingAddress } from '../../interfaces/cart'



export interface ICartState {
    isLoaded: boolean,
    cart: ICartProduct[],
    numberOfItems: number,
    subTotal: number,
    tax: number,
    total: number,
    shippingAddress? : IShippingAddress 
}


const initialState: ICartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}


export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        load_cart: (state, action: PayloadAction<ICartProduct[]>) => {
            state.cart = action.payload,
            state.isLoaded = true
        },


        add_product_to_cart: (state, action: PayloadAction<ICartProduct>) => {
            const existProduct = state.cart.some(p => p._id === action.payload._id && p.size === action.payload.size)

            if (existProduct) {
                state.cart = state.cart.map(p => {
                    if (p._id === action.payload._id && p.size === action.payload.size) {
                        p.quantity += action.payload.quantity
                    }
                    return p
                })
            }

            if (!existProduct) state.cart = [...state.cart, action.payload]
        },


        update_producto_in_cart: (state, action: PayloadAction<ICartProduct>) => {
            state.cart = state.cart.map(p => {
                if (p._id === action.payload._id && p.size === action.payload.size) {
                    return action.payload
                }
                return p
            })
        },


        remove_producto_in_cart: (state, action: PayloadAction<ICartProduct>) => {
            state.cart = state.cart.filter(p => !(p._id === action.payload._id && p.size === action.payload.size))
        },


        update_order_summary: (state, action: PayloadAction<IOrderSummary>) => {
            state.numberOfItems = action.payload.numberOfItems,
                state.subTotal = action.payload.subTotal,
                state.tax = action.payload.tax,
                state.total = action.payload.total
        },

        update_address : (state, action:PayloadAction<IShippingAddress>) => {
            state.shippingAddress = action.payload
        },

        clean_cart : (state) => {
            state.cart = []
        }
    }
})


export const { add_product_to_cart, load_cart, update_producto_in_cart, remove_producto_in_cart, update_order_summary, update_address, clean_cart} = cartSlice.actions
export default cartSlice.reducer


