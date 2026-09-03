import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { urlFor } from "../sanity";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  HeartIcon as HeartSolid,
  LocationMarkerIcon,
  QuestionMarkCircleIcon,
  StarIcon,
} from "react-native-heroicons/solid";
import { HeartIcon as HeartOutline } from "react-native-heroicons/outline";
import DishRow from "../components/DishRow";
import CartIcon from "../components/CartIcon";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setRestaurant } from "../features/restaurantSlice";
import {
  selectIsFavorite,
  toggleFavorite,
} from "../features/favoritesSlice";

const RestaurantScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    params: {
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
    },
  } = useRoute();
  const isFavorite = useSelector(selectIsFavorite(id));

  useEffect(() => {
    dispatch(
      setRestaurant({
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
      })
    );
  }, [dispatch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <>
      <CartIcon />
      <ScrollView>
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: urlFor(imgUrl).url() }}
            style={styles.heroImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={20} color="#F86874" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => dispatch(toggleFavorite(id))}
          >
            {isFavorite ? (
              <HeartSolid color="#F86874" size={22} />
            ) : (
              <HeartOutline color="#F86874" size={22} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoInner}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <StarIcon color="#FCBF67" size={22} />
                <Text style={styles.metaText}>
                  <Text style={styles.metaAccent}>{rating}</Text> . {genre}
                </Text>
              </View>

              <View style={styles.metaItem}>
                <LocationMarkerIcon color="gray" size={22} />
                <Text style={styles.metaText}>Nearby . {address}</Text>
              </View>
            </View>

            <Text style={styles.shortDescription}>{short_description}</Text>
          </View>

          <TouchableOpacity style={styles.allergyRow}>
            <QuestionMarkCircleIcon color="gray" opacity={0.6} size={20} />
            <Text style={styles.allergyText}>Have a food allergy?</Text>
            <ChevronRightIcon color="#F86874" />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.menuHeading}>Menu</Text>
          {dishes.map((dish, index) => (
            <DishRow
              key={index}
              id={dish._id}
              name={dish.name}
              description={dish.short_description}
              price={dish.price}
              image={dish.image}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  heroWrap: {
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#d1d5db",
    padding: 16,
  },
  backButton: {
    position: "absolute",
    top: 56,
    left: 20,
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 9999,
  },
  favoriteButton: {
    position: "absolute",
    top: 56,
    right: 20,
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 9999,
  },
  infoCard: {
    backgroundColor: "#ffffff",
  },
  infoInner: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    marginVertical: 4,
    gap: 8,
  },
  metaItem: {
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
  shortDescription: {
    color: "#6b7280",
    marginTop: 8,
    paddingBottom: 16,
  },
  allergyRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
    gap: 8,
  },
  allergyText: {
    paddingLeft: 8,
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
  menuHeading: {
    paddingHorizontal: 16,
    paddingTop: 24,
    marginBottom: 12,
    fontWeight: "700",
    fontSize: 20,
  },
});

export default RestaurantScreen;
