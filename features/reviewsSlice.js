import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const STORAGE_KEY = "oh-delivery:reviews";

const initialState = {
  reviews: [],
};

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload || [];
    },
    addReview: (state, action) => {
      const review = action.payload;
      if (!review || !review.id) return;
      const existingIndex = state.reviews.findIndex((r) => r.id === review.id);
      if (existingIndex >= 0) {
        state.reviews[existingIndex] = review;
      } else {
        state.reviews = [review, ...state.reviews];
      }
    },
    addRestaurantReview: (state, action) => {
      const { restaurantId, rating, text, author } = action.payload || {};
      if (!restaurantId || !rating) return;
      const review = {
        id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: "restaurant",
        restaurantId,
        rating,
        text: text || "",
        author: author || "You",
        createdAt: new Date().toISOString(),
      };
      state.reviews = [review, ...state.reviews];
    },
    addDeliveryRating: (state, action) => {
      const review = {
        id: `d-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: "delivery",
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.reviews = [review, ...state.reviews];
    },
  },
});

export const persistReviews = (reviews) => async () => {
  if (Platform.OS === "web") return;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.warn("Failed to persist reviews", e);
  }
};

export const loadReviews = () => async (dispatch) => {
  if (Platform.OS === "web") return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    dispatch(setReviews(list));
  } catch (e) {
    console.warn("Failed to load reviews", e);
  }
};

export const { setReviews, addReview, addRestaurantReview, addDeliveryRating } =
  reviewsSlice.actions;

export const selectReviews = (state) => state.reviews.reviews;

export const selectRestaurantReviews = (restaurantId) => (state) =>
  state.reviews.reviews.filter(
    (r) => r.type === "restaurant" && r.restaurantId === restaurantId
  );

export const selectRestaurantAverageRating = (restaurantId) => (state) => {
  const list = state.reviews.reviews.filter(
    (r) => r.type === "restaurant" && r.restaurantId === restaurantId
  );
  if (list.length === 0) return null;
  const sum = list.reduce((acc, r) => acc + (r.rating || 0), 0);
  return sum / list.length;
};

export default reviewsSlice.reducer;