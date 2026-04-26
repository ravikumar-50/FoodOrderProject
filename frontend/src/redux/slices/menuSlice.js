import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menu: [],
    loading: false,
    error: null,
};

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        menuRequest: (state) => {
            state.loading = true;
        },
        menuSuccess: (state, action) => {
            state.loading = false;
            state.menu = action.payload;
        },
        menuFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        },
    },
});

export const { menuRequest, menuSuccess, menuFail, clearErrors } = menuSlice.actions;
export default menuSlice.reducer;
