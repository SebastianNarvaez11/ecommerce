import { FC, ReactNode, useEffect } from "react"
import Cookie from 'js-cookie'
import { useAppDispatch } from "../store/hooks"
import { load_cart, update_address } from "../store/slices/cartSlice"
import { useSession } from "next-auth/react"
import { login } from "../store/slices/authSlice"
import { ILoginUser } from '../interfaces'

interface Props {
    children: ReactNode
}

// este componente lo usamos para envolver toda la aplicacion y correr efectos
// que necesitemos que solo se ejecuten una sola vez cuando se carga la app

export const CustomProvider: FC<Props> = ({ children }) => {

    const dispatch = useAppDispatch()
    const { data, status } = useSession()

    // efecto para validar el token y traer los datos del usuario cuando se recarga la pagina - NEXTAUTH
    useEffect(() => {
        if (status === 'authenticated') {
            dispatch(login(data.user as ILoginUser))
        }
    }, [status, data])


    // efecto para validar el token y traer los datos del usuario cuando se recarga la pagina - AUTH MANUAL
    // useEffect(() => {
    //     const token = Cookie.get('token')
    //     if (token) dispatch(validateToken())
    // }, [])


    // efecto para pasar las cookies del carrito al store
    useEffect(() => {
        const cookie_cart = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
        dispatch(load_cart(cookie_cart))
    }, [])


    // efecto para recuperar el shoppingAddress de las cookies y pasar al store
    useEffect(() => {
        if (Cookie.get('firstName')) {
            const shippingAddress = {
                firstName: Cookie.get('firstName') || '',
                lastName: Cookie.get('lastName') || '',
                address: Cookie.get('address') || '',
                address2: Cookie.get('address2') || '',
                zip: Cookie.get('zip') || '',
                city: Cookie.get('city') || '',
                country: Cookie.get('country') || '',
                phone: Cookie.get('phone') || '',
            }
            dispatch(update_address(shippingAddress))
        }
    }, [])


    return (
        <>
            {children}
        </>
    )
}
