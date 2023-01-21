import { configureStore, isAnyOf } from '@reduxjs/toolkit'
import uiSlice from './slices/uiSlice'
import cartSlice, { add_product_to_cart, clean_cart, load_cart, remove_producto_in_cart, update_order_summary, update_producto_in_cart } from './slices/cartSlice'
import Cookie from 'js-cookie'
import { cartMiddlewareListening, cartMiddleware } from './middlewares'
import authSlice from './slices/authSlice'


cartMiddlewareListening({
    matcher: isAnyOf(add_product_to_cart, update_producto_in_cart, remove_producto_in_cart, load_cart, clean_cart),
    effect: (action, listenerApi) => {

        // actualizamos el carrito que esta en la cookies
        Cookie.set('cart', JSON.stringify(listenerApi.getState().cart.cart))

        // actualizamos el order summary
        const numberOfItems = listenerApi.getState().cart.cart.reduce((prev, current) => current.quantity + prev, 0)
        const subTotal = listenerApi.getState().cart.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0)
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        }

        listenerApi.dispatch(update_order_summary(orderSummary))
    }
})


export const store = configureStore({
    reducer: {
        ui: uiSlice,
        cart: cartSlice,
        auth : authSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(cartMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch