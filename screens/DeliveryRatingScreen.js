import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { StarIcon } from "react-native-heroicons/solid";
import { addDeliveryRating, persistReviews } from "../features/reviewsSlice";
import { setOrderStatus } from "../features/ordersSlice";
import { useSelector } from "react-redux";
import { selectReviews } from "../features/reviewsSlice";

const StarRow = ({ value, onChange, testIDPrefix }) => (
  <View style={styles.starRow}>
    {[1, 2, 3, 4, 5].map((n) => (
      <TouchableOpacity
        key={n}
        onPress={() => onChange(n)}
        testID={`${testIDPrefix}-${n}`}
      >
        <StarIcon
          size={36}
          color={n <= value ? "#FCBF67" : "#e5e7eb"}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const DeliveryRatingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const orderId = route.params?.orderId;
  const reviews = useSelector(selectReviews);
  const [deliveryStars, setDeliveryStars] = useState(0);
  const [foodStars, setFoodStars] = useState(0);
  const [feedback, setFeedback] = useState("");

  const submit = () => {
    if (deliveryStars === 0 && foodStars === 0) {
      Alert.alert("Add a rating", "Tap at least one star.");
      return;
    }
    dispatch(
      addDeliveryRating({
        orderId,
        deliveryRating: deliveryStars,
        foodRating: foodStars,
        feedback,
      })
    );
    dispatch(persistReviews(reviews));
    if (orderId) {
      dispatch(setOrderStatus({ id: orderId, status: "delivered" }));
    }
    Alert.alert("Thanks!", "Your feedback was submitted.", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Home"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rate your order</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>How was the delivery?</Text>
        <StarRow
          value={deliveryStars}
          onChange={setDeliveryStars}
          testIDPrefix="delivery-rating"
        />

        <Text style={styles.sectionTitle}>How was the food?</Text>
        <StarRow
          value={foodStars}
          onChange={setFoodStars}
          testIDPrefix="food-rating"
        />

        <Text style={styles.sectionTitle}>Any feedback?</Text>
        <TextInput
          style={styles.input}
          placeholder="Tell us more..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
          testID="rating-feedback-input"
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={submit}
          testID="submit-rating-button"
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#F86874",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#374151",
    marginTop: 12,
    marginBottom: 8,
  },
  starRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#F86874",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default DeliveryRatingScreen;