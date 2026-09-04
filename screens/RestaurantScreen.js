import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
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
import { setRestaurant } from "../features/restaurantSlice";
import {
  selectIsFavorite,
  toggleFavorite,
} from "../features/favoritesSlice";
import ReviewsSection from "../components/ReviewsSection";
import {
  selectRestaurantAverageRating,
} from "../features/reviewsSlice";
import { DietaryBadges } from "../components/DietaryFilter";
import { dietaryTagsForCuisine } from "../utils/dietary";

const DEFAULT_CATEGORIES = ["Starters", "Mains", "Drinks", "Desserts"];

const hashCategory = (dish) => {
  const name = (dish?.name || "").toLowerCase();
  if (
    name.includes("tea") ||
    name.includes("drink") ||
    name.includes("juice") ||
    name.includes("coffee")
  ) {
    return "Drinks";
  }
  if (
    name.includes("cake") ||
    name.includes("dessert") ||
    name.includes("ice cream") ||
    name.includes("frappe")
  ) {
    return "Desserts";
  }
  if (
    name.includes("salad") ||
    name.includes("starter") ||
    name.includes("appetizer") ||
    name.includes("soup") ||
    name.includes("fries") ||
    name.includes("snack")
  ) {
    return "Starters";
  }
  return "Mains";
};

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
  const userAverage = useSelector(selectRestaurantAverageRating(id));
  const [search, setSearch] = useState("");

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

  const grouped = useMemo(() => {
    const filtered = (dishes || []).filter((d) =>
      search ? (d.name || "").toLowerCase().includes(search.toLowerCase()) : true
    );
    const map = {};
    DEFAULT_CATEGORIES.forEach((c) => (map[c] = []));
    for (const dish of filtered) {
      const cat = hashCategory(dish);
      map[cat].push(dish);
    }
    return map;
  }, [dishes, search]);

  const categoriesToShow = DEFAULT_CATEGORIES.filter(
    (c) => grouped[c] && grouped[c].length > 0
  );

  const effectiveRating = userAverage || rating;
  const dietary = dietaryTagsForCuisine(genre);

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
            testID="restaurant-back"
          >
            <ArrowLeftIcon size={20} color="#F86874" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => dispatch(toggleFavorite(id))}
            testID="restaurant-favorite"
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
                  <Text style={styles.metaAccent}>
                    {effectiveRating ? effectiveRating.toFixed(1) : rating}
                  </Text>{" "}
                  . {genre}
                </Text>
              </View>

              <View style={styles.metaItem}>
                <LocationMarkerIcon color="gray" size={22} />
                <Text style={styles.metaText}>Nearby . {address}</Text>
              </View>
            </View>

            <Text style={styles.shortDescription}>{short_description}</Text>
            <DietaryBadges restaurantDiet={dietary} />
          </View>

          <TouchableOpacity style={styles.allergyRow}>
            <QuestionMarkCircleIcon color="gray" opacity={0.6} size={20} />
            <Text style={styles.allergyText}>Have a food allergy?</Text>
            <ChevronRightIcon color="#F86874" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuHeader}>
          <Text style={styles.menuHeading}>Menu</Text>
          <TextInput
            testID="menu-search-input"
            placeholder="Search this menu"
            value={search}
            onChangeText={setSearch}
            style={styles.search}
          />
        </View>

        {categoriesToShow.length === 0 ? (
          <Text style={styles.emptyText}>No items match your filter.</Text>
        ) : (
          categoriesToShow.map((cat) => (
            <View key={cat} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{cat}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryRow}
              >
                {grouped[cat].map((dish) => (
                  <DishRow
                    key={dish._id}
                    id={dish._id}
                    name={dish.name}
                    description={dish.short_description}
                    price={dish.price}
                    image={dish.image}
                    variant="card"
                  />
                ))}
              </ScrollView>
            </View>
          ))
        )}

        <ReviewsSection restaurantId={id} />
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
  menuHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  menuHeading: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 8,
  },
  search: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categorySection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  categoryTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
  },
  categoryRow: {
    paddingVertical: 4,
    gap: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    paddingVertical: 24,
  },
});

export default RestaurantScreen;