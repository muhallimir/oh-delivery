import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import { StarIcon } from "react-native-heroicons/solid";
import { LocationMarkerIcon } from "react-native-heroicons/outline";
import { urlFor } from "../sanity";
import { useNavigation } from "@react-navigation/native";

const RestaurantCard = ({
  id,
  imgUrl,
  title,
  rating,
  genre,
  address,
  short_description,
  dishes,
  long,
  lat,
}) => {
  const navigation = useNavigation();

  const handleNavigation = () => {
    navigation.navigate("Restaurant", {
      id,
      imgUrl,
      title,
      rating,
      genre,
      address,
      short_description,
      dishes,
      long,
      lat,
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleNavigation}>
      <Image
        source={{
          uri: urlFor(imgUrl).url(),
        }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metaRow}>
          <StarIcon color="#FCBF67" size={22} />
          <Text style={styles.metaText}>
            <Text style={styles.metaAccent}>{rating}</Text> . {genre}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <LocationMarkerIcon color="gray" size={22} />
          <Text style={styles.metaText}>Nearby . {address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    paddingTop: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#6b7280",
  },
  metaAccent: {
    color: "#6b7280",
  },
});

export default RestaurantCard;