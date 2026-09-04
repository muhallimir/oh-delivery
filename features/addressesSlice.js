import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const STORAGE_KEY = "oh-delivery:addresses";

const initialState = {
  addresses: [
    {
      id: "home-default",
      label: "Home",
      street: "123 Main Street",
      city: "Manila",
      postal: "1000",
      country: "Philippines",
      lat: 14.5995,
      long: 120.9842,
      isDefault: true,
    },
  ],
};

export const addressesSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    setAddresses: (state, action) => {
      state.addresses = action.payload || [];
    },
    addAddress: (state, action) => {
      const addr = { ...action.payload, id: action.payload.id || `addr-${Date.now()}` };
      const list = [...state.addresses];
      if (addr.isDefault) {
        list.forEach((a) => (a.isDefault = false));
      }
      list.push(addr);
      state.addresses = list;
    },
    updateAddress: (state, action) => {
      const { id, ...patch } = action.payload;
      const list = state.addresses.map((a) => (a.id === id ? { ...a, ...patch } : a));
      if (patch.isDefault) {
        list.forEach((a) => {
          if (a.id !== id) a.isDefault = false;
        });
      }
      state.addresses = list;
    },
    removeAddress: (state, action) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
    },
    setDefaultAddress: (state, action) => {
      const id = action.payload;
      state.addresses = state.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
    },
  },
});

export const persistAddresses = (addresses) => async () => {
  if (Platform.OS === "web") return;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  } catch (e) {
    console.warn("Failed to persist addresses", e);
  }
};

export const loadAddresses = () => async (dispatch) => {
  if (Platform.OS === "web") return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : null;
    if (Array.isArray(list) && list.length > 0) {
      dispatch(setAddresses(list));
    }
  } catch (e) {
    console.warn("Failed to load addresses", e);
  }
};

export const {
  setAddresses,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
} = addressesSlice.actions;

export const selectAddresses = (state) => state.addresses.addresses;
export const selectDefaultAddress = (state) =>
  state.addresses.addresses.find((a) => a.isDefault) ||
  state.addresses.addresses[0] ||
  null;

export default addressesSlice.reducer;