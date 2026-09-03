import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import RestaurantCard from "./RestaurantCard";
import client from "../sanity";

const FeaturedRow = ({
  id,
  title,
  description,
  address,
  restaurantsOverride,
}) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (Array.isArray(restaurantsOverride)) {
      setRestaurants(restaurantsOverride);
      return;
    }
    client
      .fetch(
        `*[_type == "featured" && _id == $id] {
    ...,
    restaurants[]->{
      ...,
      dishes[]->,
      type->{
        name
      }
    },
}[0]
`,
        { id }
      )
      .then((data) => {
        setRestaurants(data?.restaurants);
      });
  }, [id, restaurantsOverride]);

  if (!restaurants || restaurants.length === 0) return null;

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <ArrowRightIcon color="#F86874" />
      </View>
      <View>
        <Text style={styles.description}>{description}</Text>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 15 }}
        showsHorizontalScrollIndicator={false}
        style={styles.cards}
      >
        {restaurants?.map((restaurant, index) => (
          <RestaurantCard
            key={index}
            id={restaurant._id}
            address={
              restaurant.address && restaurant.address.length > 20
                ? `${restaurant.address.slice(0, 20)}...`
                : restaurant.address
            }
            imgUrl={restaurant.image}
            title={restaurant.name}
            dishes={restaurant.dishes}
            rating={restaurant.rating}
            short_description={restaurant.short_description}
            genre={restaurant.type?.name}
            long={restaurant.long}
            lat={restaurant.lat}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
  },
  description: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 14,
  },
  cards: {
    paddingTop: 16,
  },
});

export default FeaturedRow;