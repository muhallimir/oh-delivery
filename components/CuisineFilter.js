import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CUISINE_OPTIONS,
  selectCuisine,
  setCuisine,
} from "../features/filtersSlice";

const CuisineFilter = () => {
  const dispatch = useDispatch();
  const active = useSelector(selectCuisine);

  return (
    <View testID="cuisine-filter-strip">
      <Text style={styles.heading}>Cuisines</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {CUISINE_OPTIONS.map((cuisine) => {
          const isActive = cuisine === active;
          return (
            <TouchableOpacity
              key={cuisine}
              testID={`cuisine-chip-${cuisine}`}
              accessibilityRole="button"
              onPress={() => dispatch(setCuisine(cuisine))}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {cuisine}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: "700",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    color: "#374151",
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#F86874",
    borderColor: "#F86874",
  },
  chipLabel: {
    fontWeight: "700",
    color: "#374151",
    fontSize: 13,
  },
  chipLabelActive: {
    color: "#ffffff",
  },
});

export default CuisineFilter;