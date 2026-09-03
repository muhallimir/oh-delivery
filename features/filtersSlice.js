import { createSlice } from "@reduxjs/toolkit";

export const CUISINE_OPTIONS = [
  "All",
  "Italian",
  "Chinese",
  "Indian",
  "Mexican",
  "Japanese",
  "American",
];

export const DIETARY_OPTIONS = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "gluten_free", label: "Gluten-free" },
  { id: "halal", label: "Halal" },
  { id: "kosher", label: "Kosher" },
];

const initialState = {
  cuisine: "All",
  dietary: [],
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCuisine: (state, action) => {
      state.cuisine = action.payload || "All";
    },
    toggleDietary: (state, action) => {
      const id = action.payload;
      if (!id) return;
      if (state.dietary.includes(id)) {
        state.dietary = state.dietary.filter((d) => d !== id);
      } else {
        state.dietary = [...state.dietary, id];
      }
    },
    clearDietary: (state) => {
      state.dietary = [];
    },
    resetFilters: (state) => {
      state.cuisine = "All";
      state.dietary = [];
    },
  },
});

export const { setCuisine, toggleDietary, clearDietary, resetFilters } =
  filtersSlice.actions;

export const selectCuisine = (state) => state.filters.cuisine;
export const selectDietary = (state) => state.filters.dietary;

export const cuisineMatches = (restaurantCuisine, filter) => {
  if (!filter || filter === "All") return true;
  if (!restaurantCuisine) return false;
  return String(restaurantCuisine).toLowerCase() === String(filter).toLowerCase();
};

export default filtersSlice.reducer;