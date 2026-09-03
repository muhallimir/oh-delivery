import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const STORAGE_KEY = "oh-delivery:orders";

const STATUSES = ["placed", "preparing", "out_for_delivery", "delivered"];

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
      const now = new Date().toISOString();
      const enriched = {
        status: "placed",
        timeline: [
          { status: "placed", at: now },
        ],
        ...order,
      };
      state.orders = [enriched, ...state.orders];
    },
    setOrderStatus: (state, action) => {
      const { id, status } = action.payload || {};
      if (!id || !status) return;
      const order = state.orders.find((o) => String(o.id) === String(id));
      if (!order) return;
      order.status = status;
      order.timeline = order.timeline || [];
      if (
        !order.timeline.find(
          (t) => t.status === status
        )
      ) {
        order.timeline = [
          ...order.timeline,
          { status, at: new Date().toISOString() },
        ];
      }
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

export const { setOrders, addOrder, setOrderStatus, clearOrders } =
  ordersSlice.actions;

export const STATUS_FLOW = STATUSES;

export const selectOrders = (state) => state.orders.orders;

export const selectOrderById = (id) => (state) =>
  state.orders.orders.find((o) => String(o.id) === String(id));

export default ordersSlice.reducer;