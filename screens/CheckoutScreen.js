import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { selectRestaurant } from "../features/restaurantSlice";
import { selectCartLines, selectItemsTotal, clearCart } from "../features/itemSlice";
import { addOrder } from "../features/ordersSlice";
import {
  selectAddresses,
  selectDefaultAddress,
} from "../features/addressesSlice";
import {
  selectPaymentMethods,
  selectDefaultMethod,
} from "../features/paymentSlice";
import { ChevronRightIcon } from "react-native-heroicons/solid";
import Currency from "../components/Currency";
import {
  ensurePermissions,
  scheduleOrderStatusNotifications,
  notifyImmediate,
} from "../utils/notifications";

const DELIVERY_FEE = 74;

const TIP_OPTIONS = [
  { id: "ten", label: "10%", value: 0.1 },
  { id: "fifteen", label: "15%", value: 0.15 },
  { id: "twenty", label: "20%", value: 0.2 },
];

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const restaurant = useSelector(selectRestaurant);
  const lines = useSelector(selectCartLines);
  const subtotal = useSelector(selectItemsTotal);
  const addresses = useSelector(selectAddresses);
  const defaultAddress = useSelector(selectDefaultAddress);
  const methods = useSelector(selectPaymentMethods);
  const defaultMethod = useSelector(selectDefaultMethod);

  const [step, setStep] = useState(1);
  const [addressId, setAddressId] = useState(defaultAddress?.id);
  const [methodId, setMethodId] = useState(defaultMethod?.id);
  const [tipId, setTipId] = useState("ten");

  useEffect(() => {
    ensurePermissions();
  }, []);

  const tip = TIP_OPTIONS.find((t) => t.id === tipId) || TIP_OPTIONS[0];
  const tipAmount = subtotal * tip.value;
  const total = subtotal + DELIVERY_FEE + tipAmount;
  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === addressId) || defaultAddress,
    [addresses, addressId, defaultAddress]
  );
  const selectedMethod = useMemo(
    () => methods.find((m) => m.id === methodId) || defaultMethod,
    [methods, methodId, defaultMethod]
  );

  const placeOrder = async () => {
    if (!restaurant) {
      Alert.alert("Missing restaurant", "Please pick a restaurant first.");
      return;
    }
    if (lines.length === 0) {
      Alert.alert("Empty cart", "Add items before placing an order.");
      return;
    }
    const orderId = `order-${Date.now()}`;
    const order = {
      id: orderId,
      placedAt: new Date().toISOString(),
      restaurantTitle: restaurant.title,
      restaurantId: restaurant.id,
      items: lines.map((l) => ({
        id: l.id,
        lineId: l.lineId,
        name: l.name,
        price: l.price,
        quantity: l.quantity,
        image: l.image,
        instructions: l.instructions,
      })),
      itemCount: lines.reduce((acc, l) => acc + l.quantity, 0),
      subtotal,
      deliveryFee: DELIVERY_FEE,
      tipAmount,
      tipId,
      total,
      address: selectedAddress,
      paymentMethod: selectedMethod,
      status: "placed",
    };

    await notifyImmediate(
      "Order confirmed",
      `Your order from ${restaurant.title} is confirmed.`
    );
    dispatch(addOrder(order));
    scheduleOrderStatusNotifications(orderId);
    dispatch(clearCart());
    navigation.replace("OrderTracking", { orderId });
  };

  const stepIndicator = (
    <View style={styles.stepRow}>
      {[1, 2, 3].map((n) => (
        <View
          key={n}
          style={[styles.stepDot, step >= n && styles.stepDotActive]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
      {stepIndicator}

      <ScrollView style={styles.body}>
        {step === 1 ? (
          <View>
            <Text style={styles.sectionTitle}>Delivery address</Text>
            {addresses.length === 0 ? (
              <Text style={styles.empty}>No saved addresses.</Text>
            ) : (
              addresses.map((addr) => (
                <TouchableOpacity
                  key={addr.id}
                  testID={`checkout-address-${addr.id}`}
                  onPress={() => setAddressId(addr.id)}
                  style={[
                    styles.optionCard,
                    addressId === addr.id && styles.optionCardActive,
                  ]}
                >
                  <Text style={styles.optionLabel}>{addr.label}</Text>
                  <Text style={styles.optionSub}>{addr.street}</Text>
                  <Text style={styles.optionSub}>
                    {addr.city} {addr.postal} . {addr.country}
                  </Text>
                </TouchableOpacity>
              ))
            )}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("AddressBook")}
              testID="open-address-book"
            >
              <Text style={styles.linkText}>Manage addresses</Text>
              <ChevronRightIcon size={18} color="#F86874" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStep(2)}
              testID="checkout-step-1-next"
            >
              <Text style={styles.primaryButtonText}>Continue to payment</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {step === 2 ? (
          <View>
            <Text style={styles.sectionTitle}>Payment method</Text>
            {methods.length === 0 ? (
              <Text style={styles.empty}>No payment methods saved.</Text>
            ) : (
              methods.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  testID={`checkout-payment-${m.id}`}
                  onPress={() => setMethodId(m.id)}
                  style={[
                    styles.optionCard,
                    methodId === m.id && styles.optionCardActive,
                  ]}
                >
                  <Text style={styles.optionLabel}>
                    {m.type === "cash" ? m.label : `${m.brand} ${m.masked}`}
                  </Text>
                  <Text style={styles.optionSub}>
                    {m.type === "cash" ? "Pay when your order arrives" : m.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("PaymentMethods")}
              testID="open-payment-methods"
            >
              <Text style={styles.linkText}>Manage payment methods</Text>
              <ChevronRightIcon size={18} color="#F86874" />
            </TouchableOpacity>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.secondaryButton]}
                onPress={() => setStep(1)}
                testID="checkout-back-2"
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, styles.flexButton]}
                onPress={() => setStep(3)}
                testID="checkout-step-2-next"
              >
                <Text style={styles.primaryButtonText}>Review order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {step === 3 ? (
          <View>
            <Text style={styles.sectionTitle}>Review</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryHeading}>
                {restaurant?.title || "Restaurant"}
              </Text>
              {lines.map((line) => (
                <View key={line.lineId} style={styles.summaryRow}>
                  <Text style={styles.summaryItem}>
                    {line.quantity}x {line.name}
                  </Text>
                  <Text>
                    <Currency quantity={line.price * line.quantity} currency="PHP" />
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Tip your rider</Text>
            <View style={styles.tipRow}>
              {TIP_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  testID={`checkout-tip-${option.id}`}
                  onPress={() => setTipId(option.id)}
                  style={[
                    styles.tipOption,
                    tipId === option.id && styles.tipOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tipLabel,
                      tipId === option.id && styles.tipLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text>Subtotal</Text>
                <Text>
                  <Currency quantity={subtotal} currency="PHP" />
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Delivery</Text>
                <Text>
                  <Currency quantity={DELIVERY_FEE} currency="PHP" />
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Tip ({tip.label})</Text>
                <Text>
                  <Currency quantity={tipAmount} currency="PHP" />
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.grandRow]}>
                <Text style={styles.grandLabel}>Total</Text>
                <Text style={styles.grandValue}>
                  <Currency quantity={total} currency="PHP" />
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Delivering to</Text>
            <Text style={styles.body2}>
              {selectedAddress?.label} . {selectedAddress?.street},{" "}
              {selectedAddress?.city}
            </Text>

            <Text style={styles.sectionTitle}>Paying with</Text>
            <Text style={styles.body2}>
              {selectedMethod?.type === "cash"
                ? selectedMethod?.label
                : `${selectedMethod?.brand} ${selectedMethod?.masked}`}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setStep(2)}
                testID="checkout-back-3"
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, styles.flexButton]}
                onPress={placeOrder}
                testID="checkout-place-order"
              >
                <Text style={styles.primaryButtonText}>Place order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
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
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 20,
  },
  closeText: {
    color: "#F86874",
    fontWeight: "700",
  },
  stepRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 16,
  },
  stepDot: {
    width: 32,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e5e7eb",
  },
  stepDotActive: {
    backgroundColor: "#F86874",
  },
  body: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#374151",
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  optionCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
  },
  optionCardActive: {
    borderColor: "#F86874",
    backgroundColor: "#fff1f2",
  },
  optionLabel: {
    fontWeight: "700",
    color: "#374151",
  },
  optionSub: {
    color: "#6b7280",
    fontSize: 12,
  },
  empty: {
    color: "#9ca3af",
    paddingVertical: 12,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  linkText: {
    color: "#F86874",
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: "#F86874",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  flexButton: {
    flex: 1,
    marginTop: 0,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 0,
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "700",
  },
  tipRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tipOption: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  tipOptionActive: {
    borderColor: "#F86874",
    backgroundColor: "#fff1f2",
  },
  tipLabel: {
    color: "#374151",
    fontWeight: "700",
  },
  tipLabelActive: {
    color: "#F86874",
  },
  summaryCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  summaryHeading: {
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryItem: {
    flex: 1,
    color: "#374151",
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
    marginBottom: 12,
  },
});

export default CheckoutScreen;