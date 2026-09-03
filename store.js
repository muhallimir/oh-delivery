import { configureStore } from "@reduxjs/toolkit";
import itemReducer from "./features/itemSlice";
import restaurantReducer from "./features/restaurantSlice";
import favoritesReducer from "./features/favoritesSlice";
import ordersReducer from "./features/ordersSlice";

export const store = configureStore({
  reducer: {
    item: itemReducer,
    restaurant: restaurantReducer,
    favorites: favoritesReducer,
    orders: ordersReducer,
  },
});
