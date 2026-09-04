import { configureStore } from "@reduxjs/toolkit";
import itemReducer from "./features/itemSlice";
import restaurantReducer from "./features/restaurantSlice";
import favoritesReducer from "./features/favoritesSlice";
import ordersReducer from "./features/ordersSlice";
import reviewsReducer from "./features/reviewsSlice";
import addressesReducer from "./features/addressesSlice";
import paymentReducer from "./features/paymentSlice";
import filtersReducer from "./features/filtersSlice";

export const store = configureStore({
  reducer: {
    item: itemReducer,
    restaurant: restaurantReducer,
    favorites: favoritesReducer,
    orders: ordersReducer,
    reviews: reviewsReducer,
    addresses: addressesReducer,
    payment: paymentReducer,
    filters: filtersReducer,
  },
});