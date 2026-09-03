import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StarIcon } from "react-native-heroicons/solid";
import {
  addRestaurantReview,
  persistReviews,
  selectReviews,
} from "../features/reviewsSlice";
import Currency from "./Currency";

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString();
  } catch (e) {
    return iso;
  }
};

const ReviewsSection = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const restaurantReviews = reviews.filter(
    (r) => r.type === "restaurant" && r.restaurantId === restaurantId
  );

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert("Add a rating", "Please tap a star before submitting.");
      return;
    }
    dispatch(
      addRestaurantReview({
        restaurantId,
        rating,
        text,
        author: "You",
      })
    );
    dispatch(persistReviews(reviews));
    setRating(0);
    setText("");
    Alert.alert("Review submitted", "Thanks for your feedback!");
  };

  return (
    <View testID="reviews-section" style={styles.wrapper}>
      <Text style={styles.heading}>Ratings & Reviews</Text>

      <View style={styles.submitCard}>
        <Text style={styles.subLabel}>Your rating</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              testID={`review-star-${n}`}
              onPress={() => setRating(n)}
            >
              <StarIcon
                size={32}
                color={n <= rating ? "#FCBF67" : "#e5e7eb"}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Share your experience..."
          multiline
          testID="review-text-input"
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          testID="submit-review-button"
        >
          <Text style={styles.submitButtonText}>Submit review</Text>
        </TouchableOpacity>
      </View>

      {restaurantReviews.length === 0 ? (
        <Text style={styles.empty}>No reviews yet. Be the first.</Text>
      ) : (
        restaurantReviews.map((r) => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.author}>{r.author || "Anonymous"}</Text>
              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon
                    key={n}
                    size={16}
                    color={n <= (r.rating || 0) ? "#FCBF67" : "#e5e7eb"}
                  />
                ))}
              </View>
            </View>
            {r.text ? <Text style={styles.reviewText}>{r.text}</Text> : null}
            <Text style={styles.reviewDate}>{formatDate(r.createdAt)}</Text>
          </View>
        ))
      )}
    </View>
  );
};

export default ReviewsSection;