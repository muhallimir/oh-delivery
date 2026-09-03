import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const STORAGE_KEY = "oh-delivery:payment";

const initialState = {
  methods: [],
  defaultMethodId: null,
};

const luhnCheck = (num) => {
  const digits = String(num).replace(/\D/g, "");
  if (digits.length < 12 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const maskCard = (num) => {
  const digits = String(num).replace(/\D/g, "");
  if (digits.length < 4) return digits;
  return "**** **** **** " + digits.slice(-4);
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPayment: (state, action) => {
      const { methods = [], defaultMethodId = null } = action.payload || {};
      state.methods = methods;
      state.defaultMethodId = defaultMethodId;
    },
    addCard: (state, action) => {
      const { number, name, expiry, cvc } = action.payload || {};
      if (!luhnCheck(number)) return { ok: false, reason: "invalid_card" };
      const card = {
        id: `card-${Date.now()}`,
        type: "card",
        last4: String(number).replace(/\D/g, "").slice(-4),
        brand: number.startsWith("4") ? "Visa" : "Card",
        masked: maskCard(number),
        name,
        expiry,
      };
      state.methods = [...state.methods, card];
      if (!state.defaultMethodId) state.defaultMethodId = card.id;
      return { ok: true, card };
    },
    addCash: (state) => {
      const exists = state.methods.find((m) => m.type === "cash");
      if (exists) return;
      const cash = {
        id: "cash-default",
        type: "cash",
        label: "Cash on Delivery",
      };
      state.methods = [...state.methods, cash];
      if (!state.defaultMethodId) state.defaultMethodId = cash.id;
    },
    removeMethod: (state, action) => {
      const id = action.payload;
      state.methods = state.methods.filter((m) => m.id !== id);
      if (state.defaultMethodId === id) {
        state.defaultMethodId = state.methods[0]?.id || null;
      }
    },
    setDefaultMethod: (state, action) => {
      state.defaultMethodId = action.payload;
    },
  },
});

export const persistPayment = (state) => async () => {
  if (Platform.OS === "web") return;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to persist payment", e);
  }
};

export const loadPayment = () => async (dispatch) => {
  if (Platform.OS === "web") return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      dispatch(setPayment(data));
    } else {
      dispatch(addCash());
    }
  } catch (e) {
    console.warn("Failed to load payment", e);
    dispatch(addCash());
  }
};

export const {
  setPayment,
  addCard,
  addCash,
  removeMethod,
  setDefaultMethod,
} = paymentSlice.actions;

export const selectPaymentMethods = (state) => state.payment.methods;
export const selectDefaultMethod = (state) =>
  state.payment.methods.find((m) => m.id === state.payment.defaultMethodId) ||
  state.payment.methods[0] ||
  null;

export default paymentSlice.reducer;