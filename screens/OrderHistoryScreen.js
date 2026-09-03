import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { XCircleIcon } from "react-native-heroicons/solid";
import { selectOrders } from "../features/ordersSlice";
import { seedCart } from "../features/itemSlice";
import Currency from "../components/Currency";

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso;
  }
};

const STATUS_LABEL = {
  placed: "Placed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

const OrderHistoryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) {
      Alert.alert("Nothing to reorder", "This order has no items.");
      return;
    }
    const seedItems = [];
    for (const item of order.items) {
      for (let i = 0; i < (item.quantity || 1); i += 1) {
        seedItems.push({
          id: item.id,
          lineId: `${item.id}-${Date.now()}-${i}`,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description,
        });
      }
    }
    dispatch(seedCart(seedItems));
    navigation.navigate("Cart");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>
            {orders.length} past order{orders.length === 1 ? "" : "s"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          testID="order-history-close"
        >
          <XCircleIcon height={50} width={50} color="#F86874" />
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyWrap} testID="order-history-empty">
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            Your placed orders will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          testID="order-history-list"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("OrderDetail", { orderId: item.id })
              }
              style={styles.card}
              testID={`order-row-${item.id}`}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.restaurantName}>
                  {item.restaurantTitle || "Restaurant"}
                </Text>
                <Text style={styles.status}>
                  {STATUS_LABEL[item.status] || item.status}
                </Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Total</Text>
                <Text style={styles.total}>
                  <Currency quantity={item.total} currency="PHP" />
                </Text>
              </View>
              <Text style={styles.date}>{formatDate(item.placedAt)}</Text>
              {item.itemCount ? (
                <Text style={styles.itemCount}>
                  {item.itemCount} item{item.itemCount === 1 ? "" : "s"}
                </Text>
              ) : null}
              <TouchableOpacity
                style={styles.reorderButton}
                onPress={() => handleReorder(item)}
                testID={`reorder-${item.id}`}
              >
                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
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
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
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
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F86874",
    textTransform: "uppercase",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
  },
  total: {
    fontWeight: "800",
  },
  date: {
    color: "#6b7280",
    fontSize: 12,
  },
  itemCount: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 2,
  },
  reorderButton: {
    marginTop: 8,
    backgroundColor: "#fff1f2",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fecdd3",
  },
  reorderText: {
    color: "#F86874",
    fontWeight: "700",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#6b7280",
    textAlign: "center",
  },
});

export default OrderHistoryScreen;