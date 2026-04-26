import api from "../../utils/api";

import {
    createOrderRequest,
    createOrderSuccess,
    createOrderFail,
    paymentRequest,
    paymentSuccess,
    paymentFail,
    myOrdersRequest,
    myOrdersSuccess,
    myOrdersFail,
    orderDetailsRequest,
    orderDetailsSuccess,
    orderDetailsFail,
    clearErrors as clearOrderErrors
} from "../slices/orderSlice";

export const createOrder = (session_id) => async (dispatch) => {
    try {
        dispatch(createOrderRequest());
        const { data } = await api.post("/v1/eats/orders/new", { session_id }, {
            headers: { "Content-Type": "application/json" }
        });
        dispatch(createOrderSuccess(data));
    } catch (error) {
        dispatch(createOrderFail(error.response?.data?.message || "Failed to create order"));
    }
}

// payment() sends the local CartContext cart items to Backend Stripe checkout
// items: array of { id, name, price, image/images, quantity }
export const payment = (items, restaurant) => async (dispatch) => {
    try {
        dispatch(paymentRequest());

        // Normalise items into the shape the backend Stripe endpoint expects:
        // { foodItem: { name, price, images: [{ url }] }, quantity }
        const normalizedItems = items.map((item) => ({
            foodItem: {
                name: item.name,
                price: item.price,
                images: item.images && item.images.length > 0
                    ? item.images
                    : [{ url: item.image || "" }],
                stock: item.stock,
            },
            quantity: item.quantity,
        }));

        const { data } = await api.post("/v1/payment/process", {
            items: normalizedItems,
            restaurant,
        }, {
            headers: { "Content-Type": "application/json" }
        });

        if (data.url) {
            window.location.href = data.url;
        }
        dispatch(paymentSuccess(data));
    } catch (error) {
        dispatch(paymentFail(error.response?.data?.message || "Payment failed"));
    }
}

export const myOrders = () => async (dispatch) => {
    try {
        dispatch(myOrdersRequest());
        const { data } = await api.get("/v1/eats/orders/me/myOrders");
        dispatch(myOrdersSuccess(data.orders));
    } catch (error) {
        dispatch(myOrdersFail(error.response?.data?.message || "Failed to fetch orders"));
    }
}

export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch(orderDetailsRequest());
        const { data } = await api.get(`/v1/eats/orders/${id}`);
        dispatch(orderDetailsSuccess(data.order));
    } catch (error) {
        dispatch(orderDetailsFail(error.response?.data?.message || "Failed to fetch order"));
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch(clearOrderErrors());
}
