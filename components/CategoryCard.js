import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import { urlFor } from "../sanity";

const CategoryCard = ({ imgUrl, title }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ uri: urlFor(imgUrl).url() }}
        style={styles.image}
      />
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    marginRight: 8,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 4,
  },
  label: {
    position: "absolute",
    bottom: 4,
    left: 4,
    color: "#ffffff",
    fontWeight: "700",
  },
});

export default CategoryCard;