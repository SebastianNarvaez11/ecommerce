import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface UIState {
    isMenuOpen: boolean,
    searchTerm: string
}

const initialState: UIState = {
    isMenuOpen: false,
    searchTerm: ''
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {

        set_is_menu_open: (state) => {
            state.isMenuOpen = !state.isMenuOpen
        },

        set_search_term: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload
        }
    }
})

export const { set_is_menu_open, set_search_term} = uiSlice.actions
export default uiSlice.reducer