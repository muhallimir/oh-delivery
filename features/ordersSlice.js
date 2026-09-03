import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const STORAGE_KEY = "oh-delivery:orders";

const initialState = {
  orders: [],
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload || [];
    },
    addOrder: (state, action) => {
      const order = action.payload;
      if (!order || !order.id) return;
      state.orders = [order, ...state.orders];
    },
    clearOrders: (state) => {
      state.orders = [];
    },
  },
});

export const persistOrders = (orders) => async () => {
  if (Platform.OS === "web") return;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn("Failed to persist orders", e);
  }
};

export const loadOrders = () => async (dispatch) => {
  if (Platform.OS === "web") return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    dispatch(setOrders(list));
  } catch (e) {
    console.warn("Failed to load orders", e);
  }
};

export const { setOrders, addOrder, clearOrders } = ordersSlice.actions;

export const selectOrders = (state) => state.orders.orders;

export default ordersSlice.reducer;
