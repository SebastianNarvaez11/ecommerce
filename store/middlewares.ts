import { createListenerMiddleware, addListener } from '@reduxjs/toolkit'
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './store'




export const cartMiddleware = createListenerMiddleware()




export type AppStartListening = TypedStartListening<RootState, AppDispatch>

export const cartMiddlewareListening = cartMiddleware.startListening as AppStartListening

export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>