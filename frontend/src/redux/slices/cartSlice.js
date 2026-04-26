import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    restaurants: {},
    loading: false,
    error: null
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        cartRequest: (state) => {
            state.loading = true;
        },
        cartSuccess: (state, action) => {
            state.loading = false;
            state.cartItems = action.payload.cartItems;
            state.restaurants = action.payload.restaurants;
        },
        cartFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateCartSuccess: (state, action) => {
            state.cartItems = action.payload.cartItems;
        },
        removeCartSuccess: (state, action) => {
            state.cartItems = action.payload?.cart?.items || [];
        },
        clearCart: (state) => {
            state.cartItems = [];
        },
        clearErrors: (state) => {
            state.error = null;
        },
        saveDeliveryDate: (state, action) => {
            state.deliveryDate = action.payload;
        },
    },
});

export const { cartRequest, cartSuccess, cartFail, updateCartSuccess, removeCartSuccess, clearCart, clearErrors, saveDeliveryDate } = cartSlice.actions;
export default cartSlice.reducer;