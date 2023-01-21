import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ILoginUser, IUser } from '../../interfaces'

export interface IAuth {
    isLoggedIn: boolean,
    user?: ILoginUser
}

const initialState: IAuth = {
    isLoggedIn: false,
    user: undefined
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        login: (state, action: PayloadAction<ILoginUser>) => {
            state.user = action.payload,
            state.isLoggedIn = true
        }
    }
})

export const { login } = authSlice.actions
export default authSlice.reducer