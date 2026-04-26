import api from "../../utils/api";
import {
    cartRequest,
    cartSuccess,
    cartFail,
    updateCartSuccess,
    removeCartSuccess,
    clearCart,
    clearErrors,
    saveDeliveryDate,
} from "../slices/cartSlice";

// Backend route: GET /api/v1/eats/cart/get-cart (protected)
export const fetchCartItems = () => async (dispatch) => {
    try {
        dispatch(cartRequest());
        const { data } = await api.get("/v1/eats/cart/get-cart");
        // Backend returns { status: "success", data: cart }
        // cart has { items: [...], restaurant: {...} }
        dispatch(cartSuccess({
            cartItems: data.data?.items || [],
            restaurants: data.data?.restaurant || {},
        }));
    } catch (error) {
        dispatch(cartFail(error.response?.data?.message || "Failed to fetch cart"));
    }
}

// Backend route: POST /api/v1/eats/cart/add-to-cart
export const addItemToCart = (foodItemId, restaurantId, quantity) => async (dispatch, getState) => {
    try {
        dispatch(cartRequest());
        const { user } = getState().user;
        const { data } = await api.post("/v1/eats/cart/add-to-cart", {
            userId: user._id,
            foodItemId,
            restaurantId,
            quantity
        });
        dispatch(cartSuccess({
            cartItems: data.cart?.items || [],
            restaurants: data.cart?.restaurant || {},
        }));
    } catch (error) {
        dispatch(cartFail(error.response?.data?.message || "Failed to add to cart"));
    }
}

// Backend route: POST /api/v1/eats/cart/update-cart-item
export const updateCartQuantity = (foodItemId, quantity) => async (dispatch, getState) => {
    try {
        const { user } = getState().user;
        const { data } = await api.post("/v1/eats/cart/update-cart-item", {
            userId: user._id,
            foodItemId,
            quantity
        });
        dispatch(updateCartSuccess({
            cartItems: data.cart?.items || [],
        }));
    } catch (error) {
        dispatch(cartFail(error.response?.data?.message || "Failed to update cart"));
    }
}

// Backend route: DELETE /api/v1/eats/cart/delete-cart-item
export const removeItemFromCart = (foodItemId) => async (dispatch, getState) => {
    try {
        const { user } = getState().user;
        const { data } = await api.delete("/v1/eats/cart/delete-cart-item", {
            data: {
                userId: user._id,
                foodItemId,
            }
        });
        dispatch(removeCartSuccess({
            cartItems: data.cart?.items || [],
        }));
    } catch (error) {
        dispatch(cartFail(error.response?.data?.message || "Failed to remove from cart"));
    }
}