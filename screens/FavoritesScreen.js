import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { XCircleIcon, HeartIcon } from "react-native-heroicons/solid";
import { urlFor } from "../sanity";
import { selectFavorites, removeFavorite } from "../features/favoritesSlice";

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const favoriteIds = useSelector(selectFavorites);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!favoriteIds || favoriteIds.length === 0) {
      setFavorites([]);
      return;
    }
    (async () => {
      const { client } = await import("../sanity");
      const data = await client.fetch(
        `*[_type == "restaurant" && _id in $ids]{
          ...,
          type->{name}
        }`,
        { ids: favoriteIds }
      );
      setFavorites(data || []);
    })();
  }, [favoriteIds]);

  const confirmRemove = (id, title) => {
    Alert.alert(
      "Remove favorite",
      `Remove ${title} from your favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => dispatch(removeFavorite(id)),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Favorites</Text>
          <Text style={styles.headerSubtitle}>
            {favoriteIds.length} saved restaurant
            {favoriteIds.length === 1 ? "" : "s"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          testID="favorites-close"
        >
          <XCircleIcon height={50} width={50} color="#F86874" />
        </TouchableOpacity>
      </View>

      {favoriteIds.length === 0 ? (
        <View style={styles.emptyWrap} testID="favorites-empty">
          <HeartIcon size={56} color="#e5e7eb" />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart on a restaurant to save it here.
          </Text>
          <TouchableOpacity
            style={styles.cta}
            onPress={() => navigation.navigate("Home")}
            testID="favorites-discover"
          >
            <Text style={styles.ctaText}>Discover restaurants</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.gridWrap}>
          <View style={styles.grid}>
            {favorites.map((r) => (
              <View key={r._id} style={styles.card}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Restaurant", {
                      id: r._id,
                      imgUrl: r.image,
                      title: r.name,
                      rating: r.rating,
                      genre: r.type?.name,
                      address: r.address,
                      short_description: r.short_description,
                      dishes: r.dishes,
                      long: r.long,
                      lat: r.lat,
                    })
                  }
                  testID={`favorite-card-${r._id}`}
                >
                  <Image
                    source={{ uri: urlFor(r.image).url() }}
                    style={styles.cardImage}
                  />
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {r.name}
                  </Text>
                  <Text style={styles.cardMeta} numberOfLines={1}>
                    {r.type?.name} . {r.rating}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onLongPress={() => confirmRemove(r._id, r.name)}
                  onPress={() => confirmRemove(r._id, r.name)}
                  style={styles.removeButton}
                  testID={`favorite-remove-${r._id}`}
                >
                  <Text style={styles.removeLabel}>Swipe / Tap to remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  headerSubtitle: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 2,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 9999,
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginTop: 12,
  },
  emptySubtitle: {
    color: "#6b7280",
    textAlign: "center",
  },
  cta: {
    marginTop: 16,
    backgroundColor: "#F86874",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  gridWrap: {
    padding: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 130,
    backgroundColor: "#e5e7eb",
  },
  cardTitle: {
    fontWeight: "700",
    color: "#374151",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  cardMeta: {
    color: "#9ca3af",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingTop: 2,
    paddingBottom: 8,
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#f3f4f6",
    alignItems: "center",
  },
  removeLabel: {
    color: "#F86874",
    fontSize: 11,
    fontWeight: "700",
  },
});

export default FavoritesScreen;