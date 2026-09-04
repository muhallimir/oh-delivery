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
  DIETARY_OPTIONS,
  selectDietary,
  toggleDietary,
} from "../features/filtersSlice";

const DietaryFilter = ({ inline = false }) => {
  const dispatch = useDispatch();
  const active = useSelector(selectDietary);

  const content = (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {DIETARY_OPTIONS.map((diet) => {
        const isActive = active.includes(diet.id);
        return (
          <TouchableOpacity
            key={diet.id}
            testID={`diet-toggle-${diet.id}`}
            onPress={() => dispatch(toggleDietary(diet.id))}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Text
              style={[styles.chipLabel, isActive && styles.chipLabelActive]}
            >
              {diet.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  if (inline) return content;
  return (
    <View>
      <Text style={styles.heading}>Dietary preferences</Text>
      {content}
    </View>
  );
};

export const DietaryBadges = ({ restaurantDiet = [] }) => {
  if (!restaurantDiet || restaurantDiet.length === 0) return null;
  return (
    <View style={styles.badges}>
      {restaurantDiet.map((d) => (
        <View key={d} style={styles.badge}>
          <Text style={styles.badgeLabel}>{d}</Text>
        </View>
      ))}
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
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "#fff1f2",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#fecdd3",
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#F86874",
  },
});

export default DietaryFilter;