import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    order: null,
    orders: []
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        createOrderRequest: (state) => {
            state.loading = true;
        },
        createOrderSuccess: (state, action) => {
            state.loading = false;
            state.order = action.payload;
        },
        createOrderFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        },
        paymentRequest: (state) => {
            state.loading = true;
        },
        paymentSuccess: (state, action) => {
            state.loading = false;
            state.order = action.payload;
        },
        paymentFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        myOrdersRequest: (state) => {
            state.loading = true;
        },
        myOrdersSuccess: (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        },
        myOrdersFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        orderDetailsRequest: (state) => {
            state.loading = true;
        },
        orderDetailsSuccess: (state, action) => {
            state.loading = false;
            state.order = action.payload;
        },
        orderDetailsFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})

export const { 
    createOrderRequest, 
    createOrderSuccess, 
    createOrderFail, 
    clearErrors, 
    paymentRequest, 
    paymentSuccess, 
    paymentFail, 
    myOrdersRequest, 
    myOrdersSuccess, 
    myOrdersFail, 
    orderDetailsRequest, 
    orderDetailsSuccess, 
    orderDetailsFail 
} = orderSlice.actions;

export default orderSlice.reducer;
