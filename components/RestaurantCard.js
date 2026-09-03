import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React from "react";
import { StarIcon, HeartIcon as HeartSolid } from "react-native-heroicons/solid";
import {
  HeartIcon as HeartOutline,
  LocationMarkerIcon,
} from "react-native-heroicons/outline";
import { urlFor } from "../sanity";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsFavorite,
  toggleFavorite,
} from "../features/favoritesSlice";

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
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(id));

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

  const handleToggleFavorite = (e) => {
    e.stopPropagation && e.stopPropagation();
    dispatch(toggleFavorite(id));
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleNavigation}>
      <View style={styles.imageWrap}>
        <Image
          source={{
            uri: urlFor(imgUrl).url(),
          }}
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleToggleFavorite}
        >
          {isFavorite ? (
            <HeartSolid color="#F86874" size={26} />
          ) : (
            <HeartOutline color="#ffffff" size={26} />
          )}
        </TouchableOpacity>
      </View>
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
  imageWrap: {
    position: "relative",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 9999,
    padding: 6,
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
