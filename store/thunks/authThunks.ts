import axios from 'axios'
import { tesloApi } from '../../axios';
import { IResponseLogin } from '../../interfaces';
import { login } from '../slices/authSlice';
import { AppDispatch } from './../store';
import Cookie from 'js-cookie'


interface IResponseRegister {
    hasError: boolean,
    message?: string
}





export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {

    try {
        const { data } = await tesloApi.post<IResponseLogin>('/auth/login', { email, password })
        const { token, user } = data
        Cookie.set('token', token)
        dispatch(login(user))
        return true

    } catch (error) {
        console.log(error);
        return false
    }
}



export const registerUser = (name: string, email: string, password: string) => async (dispatch: AppDispatch): Promise<IResponseRegister> => {

    try {
        const { data } = await tesloApi.post<IResponseLogin>('/auth/register', { name, email, password })
        const { token, user } = data
        Cookie.set('token', token)
        dispatch(login(user))

        return { hasError: false }

    } catch (error) {
        if (axios.isAxiosError(error)) return { hasError: true, message: error.response?.data.message }

        return { hasError: true, message: 'No se puedo crear el usuario, intente nuevamente' }
    }
}




export const validateToken = () => async (dispatch: AppDispatch) => {

    try {
        const { data } = await tesloApi.get<IResponseLogin>('/auth/validate-token')

        const { token, user } = data
        Cookie.set('token', token)
        dispatch(login(user))

    } catch (error) {
        Cookie.remove('token')
        console.log('token no valido, se elimino de las cookies')
    }
}


