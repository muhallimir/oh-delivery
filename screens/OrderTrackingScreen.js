import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrderById,
  setOrderStatus,
  STATUS_FLOW,
} from "../features/ordersSlice";
import {
  PhoneIcon,
  ChatBubbleLeftIcon,
} from "react-native-heroicons/outline";
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XIcon,
  StarIcon,
} from "react-native-heroicons/solid";

let MapView = null;
let Marker = null;
let Polyline = null;
if (Platform.OS !== "web") {
  try {
    const Maps = require("react-native-maps");
    MapView = Maps.default;
    Marker = Maps.Marker;
    Polyline = Maps.Polyline;
  } catch (e) {
    MapView = null;
  }
}

const STATUS_META = {
  placed: { label: "Order placed", Icon: CheckCircleIcon },
  preparing: { label: "Preparing your food", Icon: ClockIcon },
  out_for_delivery: { label: "Out for delivery", Icon: TruckIcon },
  delivered: { label: "Delivered", Icon: CheckCircleIcon },
};

const STEP_DELAY = 5000;
const RIDER_TICK = 5000;

const OrderTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const orderId = route.params?.orderId;
  const order = useSelector(selectOrderById(orderId));

  const [riderPos, setRiderPos] = useState({
    latitude: order?.address?.lat || 14.5995,
    longitude: order?.address?.long || 120.9842,
  });

  const statusIndex = useMemo(() => {
    if (!order) return 0;
    return STATUS_FLOW.indexOf(order.status);
  }, [order]);

  const stepTimers = useRef([]);

  useEffect(() => {
    if (!order) return;
    if (statusIndex >= STATUS_FLOW.length - 1) return;
    const nextIndex = statusIndex + 1;
    const nextStatus = STATUS_FLOW[nextIndex];
    const delay =
      nextStatus === "preparing"
        ? STEP_DELAY
        : nextStatus === "out_for_delivery"
        ? STEP_DELAY * 3
        : STEP_DELAY * 6;
    const id = setTimeout(() => {
      dispatch(setOrderStatus({ id: orderId, status: nextStatus }));
      if (nextStatus === "delivered") {
        navigation.replace("DeliveryRating", { orderId });
      }
    }, delay);
    stepTimers.current.push(id);
    return () => {
      stepTimers.current.forEach((t) => clearTimeout(t));
      stepTimers.current = [];
    };
  }, [statusIndex, orderId, order, dispatch, navigation]);

  useEffect(() => {
    if (!order) return;
    if (order.status !== "out_for_delivery") return;
    const id = setInterval(() => {
      setRiderPos((current) => {
        const restaurantLat = 14.5995;
        const restaurantLong = 120.9842;
        const targetLat = order.address?.lat || restaurantLat;
        const targetLong = order.address?.long || restaurantLong;
        const latStep = (targetLat - current.latitude) * 0.15;
        const lngStep = (targetLong - current.longitude) * 0.15;
        return {
          latitude: current.latitude + latStep,
          longitude: current.longitude + lngStep,
        };
      });
    }, RIDER_TICK);
    return () => clearInterval(id);
  }, [order, orderId]);

  const eta = useMemo(() => {
    if (!order) return "30-35 min";
    if (order.status === "delivered") return "Delivered";
    if (order.status === "out_for_delivery") return "5-10 min";
    if (order.status === "preparing") return "20-25 min";
    return "30-35 min";
  }, [order]);

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.empty}>Order not found.</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>Go home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSafeArea}>
        <View style={styles.topBar}>
          <Text style={styles.helpText}>Live tracking</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            testID="tracking-close"
          >
            <XIcon color={"#fff"} size={28} />
          </TouchableOpacity>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <Text style={styles.arrivalLabel}>Estimated arrival</Text>
              <Text style={styles.arrivalTime}>{eta}</Text>
            </View>
            <StarIcon color="#FCBF67" size={32} />
          </View>
        </View>

        <View style={styles.timeline}>
          {STATUS_FLOW.map((status, idx) => {
            const meta = STATUS_META[status];
            const reached = idx <= statusIndex;
            const Icon = meta?.Icon || CheckCircleIcon;
            return (
              <View key={status} style={styles.timelineRow}>
                <View
                  style={[
                    styles.timelineDot,
                    reached && styles.timelineDotActive,
                  ]}
                >
                  <Icon size={14} color={reached ? "#ffffff" : "#9ca3af"} />
                </View>
                <Text
                  style={[
                    styles.timelineLabel,
                    reached && styles.timelineLabelActive,
                  ]}
                  testID={`timeline-${status}`}
                >
                  {meta?.label}
                </Text>
              </View>
            );
          })}
        </View>
      </SafeAreaView>

      {Platform.OS === "web" || !MapView ? (
        <View style={styles.webMapFallback}>
          <Text style={styles.webMapTitle}>
            {order.address?.label || "Live map"}
          </Text>
          <Text style={styles.webMapHint}>
            Map tracking is available on iOS and Android. Open the Expo Go app to
            watch your rider move in real time.
          </Text>
          <Text style={styles.webMapHint}>
            Rider position: {riderPos.latitude.toFixed(4)},{" "}
            {riderPos.longitude.toFixed(4)}
          </Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: riderPos.latitude,
            longitude: riderPos.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={riderPos}
            title="Rider"
            description="On the way"
            identifier="rider"
            pinColor="#F86874"
          />
          {order.address ? (
            <Marker
              coordinate={{
                latitude: order.address.lat,
                longitude: order.address.long,
              }}
              title={order.address.label || "Destination"}
              pinColor="#3b82f6"
            />
          ) : null}
        </MapView>
      )}

      <SafeAreaView style={styles.bottomBar}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Calling rider", "Connecting you to your rider.")
            }
            testID="rider-call"
          >
            <PhoneIcon size={20} color="#F86874" />
            <Text style={styles.actionLabel}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Message rider", "Opening message thread.")
            }
            testID="rider-message"
          >
            <ChatBubbleLeftIcon size={20} color="#F86874" />
            <Text style={styles.actionLabel}>Message</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cd6465",
  },
  topSafeArea: {
    zIndex: 50,
    paddingTop: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  helpText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    padding: 12,
    backgroundColor: "#F86874",
    borderRadius: 8,
    margin: 20,
  },
  closeText: {
    color: "#ffffff",
    fontWeight: "700",
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 6,
    padding: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusInfo: {
    flex: 1,
  },
  arrivalLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  arrivalTime: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  timeline: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 6,
    padding: 12,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
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
  map: {
    flex: 1,
    marginTop: 12,
  },
  webMapFallback: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  webMapTitle: {
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    fontSize: 18,
  },
  webMapHint: {
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 8,
  },
  bottomBar: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#F86874",
    gap: 6,
  },
  actionLabel: {
    color: "#F86874",
    fontWeight: "700",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    color: "#9ca3af",
    marginBottom: 16,
  },
});

export default OrderTrackingScreen;