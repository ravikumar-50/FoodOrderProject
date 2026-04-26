import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const getRestaurants = createAsyncThunk('restaurants/getRestaurants', async (keyword = " ", { rejectWithValue }) => {
    try {
        const response = await api.get(`/eats/stores?keyword=${keyword}`);
        const { data } = response;
        console.log("Fetched Restaurant", data);
        return {
            restaurants: data.restaurants,
            count: data.count,
        }
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
})
