import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useMemo } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrderById,
  STATUS_FLOW,
} from "../features/ordersSlice";
import { XCircleIcon } from "react-native-heroicons/solid";
import { urlFor } from "../sanity";
import Currency from "../components/Currency";
import { seedCart } from "../features/itemSlice";

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso;
  }
};

const STATUS_LABEL = {
  placed: "Order placed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const orderId = route.params?.orderId;
  const order = useSelector(selectOrderById(orderId));

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const statusIndex = useMemo(() => {
    if (!order) return 0;
    return STATUS_FLOW.indexOf(order.status);
  }, [order]);

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Order not found</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}
            testID="order-detail-back"
          >
            <Text style={styles.primaryButtonText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleReorder = () => {
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
          <Text style={styles.headerTitle}>Order detail</Text>
          <Text style={styles.headerSubtitle}>
            {order.restaurantTitle || "Restaurant"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          testID="order-detail-close"
        >
          <XCircleIcon height={50} width={50} color="#F86874" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.statusValue} testID="order-status">
            {STATUS_LABEL[order.status] || order.status}
          </Text>
          <Text style={styles.date}>{formatDate(order.placedAt)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>
          {(order.items || []).map((item, idx) => (
            <View
              key={`${item.lineId || item.id || idx}`}
              style={styles.itemRow}
            >
              {item.image ? (
                <View style={styles.thumb}>
                  <Text style={styles.thumbLabel}>
                    {String(item.name || "?").charAt(0)}
                  </Text>
                </View>
              ) : null}
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>x{item.quantity || 1}</Text>
                {item.instructions ? (
                  <Text style={styles.itemNote}>Note: {item.instructions}</Text>
                ) : null}
              </View>
              <Text>
                <Currency
                  quantity={(item.price || 0) * (item.quantity || 1)}
                  currency="PHP"
                />
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          {STATUS_FLOW.map((status, idx) => {
            const reached = idx <= statusIndex;
            const label = STATUS_LABEL[status];
            const entry = (order.timeline || []).find((t) => t.status === status);
            return (
              <View key={status} style={styles.timelineRow}>
                <View
                  style={[
                    styles.timelineDot,
                    reached && styles.timelineDotActive,
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.timelineLabel, reached && styles.timelineLabelActive]}>
                    {label}
                  </Text>
                  {entry ? (
                    <Text style={styles.timelineDate}>
                      {formatDate(entry.at)}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Totals</Text>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>
              <Currency quantity={order.subtotal || 0} currency="PHP" />
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Delivery</Text>
            <Text>
              <Currency quantity={order.deliveryFee || 0} currency="PHP" />
            </Text>
          </View>
          {order.tipAmount ? (
            <View style={styles.totalRow}>
              <Text>Tip</Text>
              <Text>
                <Currency quantity={order.tipAmount} currency="PHP" />
              </Text>
            </View>
          ) : null}
          <View style={[styles.totalRow, styles.grandRow]}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>
              <Currency quantity={order.total || 0} currency="PHP" />
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery to</Text>
          <Text style={styles.body2}>
            {order.address?.label} . {order.address?.street}
          </Text>
          <Text style={styles.body2}>
            {order.address?.city} {order.address?.postal}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleReorder}
          testID="order-detail-reorder"
        >
          <Text style={styles.primaryButtonText}>Reorder</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
  },
  statusValue: {
    color: "#F86874",
    fontWeight: "700",
    fontSize: 18,
    marginTop: 4,
  },
  date: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 8,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbLabel: {
    color: "#9ca3af",
    fontWeight: "700",
  },
  itemName: {
    fontWeight: "700",
    color: "#374151",
  },
  itemMeta: {
    color: "#9ca3af",
    fontSize: 12,
  },
  itemNote: {
    color: "#9ca3af",
    fontSize: 11,
    fontStyle: "italic",
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    marginRight: 12,
  },
  timelineDotActive: {
    backgroundColor: "#F86874",
  },
  timelineLabel: {
    color: "#9ca3af",
  },
  timelineLabelActive: {
    color: "#374151",
    fontWeight: "700",
  },
  timelineDate: {
    color: "#9ca3af",
    fontSize: 11,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  grandRow: {
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 8,
    paddingTop: 8,
  },
  grandLabel: {
    fontWeight: "700",
  },
  grandValue: {
    fontWeight: "800",
  },
  body2: {
    color: "#6b7280",
  },
  primaryButton: {
    backgroundColor: "#F86874",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    color: "#9ca3af",
    fontSize: 18,
    marginBottom: 16,
  },
});

export default OrderDetailScreen;