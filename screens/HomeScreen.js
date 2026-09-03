import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/logo.png";
import {
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  UserIcon,
  ChevronDownIcon,
  SearchIcon,
  AdjustmentsIcon,
  ShoppingBagIcon,
  HeartIcon,
} from "react-native-heroicons/outline";
import Categories from "../components/Categories";
import FeaturedRow from "../components/FeaturedRow";
import CuisineFilter from "../components/CuisineFilter";
import DietaryFilter from "../components/DietaryFilter";
import { useNavigation } from "@react-navigation/core";
import { useDispatch, useSelector } from "react-redux";
import {
  loadFavorites,
  persistFavorites,
  selectFavorites,
} from "../features/favoritesSlice";
import { loadOrders, persistOrders, selectOrders } from "../features/ordersSlice";
import { loadReviews, persistReviews, selectReviews } from "../features/reviewsSlice";
import { loadAddresses, persistAddresses, selectAddresses } from "../features/addressesSlice";
import { loadPayment, persistPayment } from "../features/paymentSlice";
import {
  selectCuisine,
  selectDietary,
  cuisineMatches,
} from "../features/filtersSlice";
import { supportsDiet } from "../utils/dietary";

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const favorites = useSelector(selectFavorites);
  const orders = useSelector(selectOrders);
  const reviews = useSelector(selectReviews);
  const addresses = useSelector(selectAddresses);
  const payment = useSelector((s) => s.payment);
  const cuisine = useSelector(selectCuisine);
  const dietary = useSelector(selectDietary);

  useEffect(() => {
    dispatch(loadFavorites());
    dispatch(loadOrders());
    dispatch(loadReviews());
    dispatch(loadAddresses());
    dispatch(loadPayment());
  }, [dispatch]);

  useEffect(() => {
    dispatch(persistFavorites(favorites));
  }, [dispatch, favorites]);

  useEffect(() => {
    dispatch(persistOrders(orders));
  }, [dispatch, orders]);

  useEffect(() => {
    dispatch(persistReviews(reviews));
  }, [dispatch, reviews]);

  useEffect(() => {
    dispatch(persistAddresses(addresses));
  }, [dispatch, addresses]);

  useEffect(() => {
    dispatch(persistPayment(payment));
  }, [dispatch, payment]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleNavigation = async () => {
    const { client } = await import("../sanity");
    client
      .fetch(
        `*[_type == "featured"] {
        ...,
        restaurants[]->{
          ...,
          dishes[]->,
          type->{
            name
          }
        }
      }`
      )
      .then((data) => {
        setFeaturedCategories(data);
      });
  };

  useEffect(() => {
    handleNavigation();
  }, []);

  const filterRestaurants = (restaurants = []) => {
    if (!restaurants) return [];
    return restaurants.filter((r) => {
      if (!cuisineMatches(r.type?.name, cuisine)) return false;
      if (dietary.length === 0) return true;
      return dietary.every((d) => supportsDiet(r.type?.name, d));
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.headerText}>
          <Text style={styles.deliverLabel}>Deliver Now!</Text>
          <Text style={styles.locationLabel}>
            Current Location
            <ChevronDownIcon size={20} color="#F86874" />
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Favorites")}
          style={styles.iconButton}
          testID="open-favorites"
        >
          <HeartIcon size={26} color="#F86874" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("OrderHistory")}
          style={styles.iconButton}
          testID="open-orders"
        >
          <ShoppingBagIcon size={26} color="#F86874" />
          {orders.length > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{orders.length}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
        <UserIcon size={35} color="#F86874" />
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <SearchIcon size={25} color="gray" />
          <TextInput
            placeholder="Restaurants and Cuisines.."
            keyboardType="default"
          />
        </View>
        <AdjustmentsIcon size={20} color="#F86874" />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Categories />
        <CuisineFilter />
        <DietaryFilter />
        {featuredCategories?.map((category, index) => {
          const filtered = filterRestaurants(category.restaurants);
          if (filtered.length === 0) return null;
          return (
            <FeaturedRow
              key={index}
              id={category._id}
              title={category.title}
              description={category.short_description}
              restaurantsOverride={filtered}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ffffff",
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    paddingBottom: 12,
    alignItems: "center",
    marginHorizontal: 16,
    gap: 8,
  },
  logo: {
    height: 28,
    width: 28,
    backgroundColor: "#d1d5db",
    padding: 20,
    borderRadius: 9999,
  },
  headerText: {
    flex: 1,
  },
  deliverLabel: {
    fontWeight: "700",
    color: "#9ca3af",
    fontSize: 12,
  },
  locationLabel: {
    fontWeight: "700",
    fontSize: 20,
  },
  iconButton: {
    padding: 4,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#F86874",
    borderRadius: 9999,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
    marginHorizontal: 16,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#e5e7eb",
    padding: 12,
  },
  body: {
    backgroundColor: "#f3f4f6",
  },
});

export default HomeScreen;