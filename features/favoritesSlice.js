import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const STORAGE_KEY = "oh-delivery:favorites";

const initialState = {
  restaurants: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.restaurants = action.payload || [];
    },
    addFavorite: (state, action) => {
      const id = action.payload;
      if (id && !state.restaurants.includes(id)) {
        state.restaurants.push(id);
      }
    },
    removeFavorite: (state, action) => {
      const id = action.payload;
      state.restaurants = state.restaurants.filter((r) => r !== id);
    },
    toggleFavorite: (state, action) => {
      const id = action.payload;
      if (!id) return;
      if (state.restaurants.includes(id)) {
        state.restaurants = state.restaurants.filter((r) => r !== id);
      } else {
        state.restaurants.push(id);
      }
    },
  },
});

export const persistFavorites = (favorites) => async () => {
  if (Platform.OS === "web") return;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.warn("Failed to persist favorites", e);
  }
};

export const loadFavorites = () => async (dispatch) => {
  if (Platform.OS === "web") return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    dispatch(setFavorites(list));
  } catch (e) {
    console.warn("Failed to load favorites", e);
  }
};

export const { setFavorites, addFavorite, removeFavorite, toggleFavorite } =
  favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.restaurants;

export const selectIsFavorite = (id) => (state) =>
  state.favorites.restaurants.includes(id);

export default favoritesSlice.reducer;
