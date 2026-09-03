import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurants: {
    id: null,
    imgUrl: null,
    title: null,
    rating: null,
    genre: null,
    address: null,
    short_description: null,
    dishes: null,
  },
};

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (state, action) => {
      state.restaurants = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRestaurant } = restaurantSlice.actions;

// Selectors
export const selectRestaurant = (state) => state.restaurant.restaurants;

export default restaurantSlice.reducer;
