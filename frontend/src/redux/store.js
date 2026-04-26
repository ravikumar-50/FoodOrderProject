import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "./slices/restaurantSlice";
import userReducer from "./slices/userSlice";
import menuReducer from "./slices/menuSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
const store = configureStore({
    reducer: {
        restaurants: restaurantReducer,
        user: userReducer,
        menus: menuReducer,
        cart: cartReducer,
        order: orderReducer
    },
});
export default store;