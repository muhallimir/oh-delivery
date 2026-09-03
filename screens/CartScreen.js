import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { selectRestaurant } from "../features/restaurantSlice";
import {
  decreaseItemCount,
  increaseItemCount,
  removeItemLine,
  selectCartLines,
  selectItemsTotal,
} from "../features/itemSlice";
import { XCircleIcon } from "react-native-heroicons/solid";
import logo from "../assets/images/logo.png";
import { ScrollView } from "react-native-gesture-handler";
import { urlFor } from "../sanity";
import Currency from "../components/Currency";

const DELIVERY_FEE = 74;

const CartScreen = () => {
  const navigation = useNavigation();
  const restaurant = useSelector(selectRestaurant);
  const cartTotal = useSelector(selectItemsTotal);
  const lines = useSelector(selectCartLines);
  const dispatch = useDispatch();

  const grandTotal = cartTotal + DELIVERY_FEE;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Current items</Text>
            <Text style={styles.headerSubtitle}>{restaurant?.title}</Text>
          </View>

          <TouchableOpacity
            onPress={navigation.goBack}
            style={styles.closeButton}
          >
            <XCircleIcon height={50} width={50} color="#F86874" />
          </TouchableOpacity>
        </View>

        <View style={styles.deliveryRow}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.deliveryText}>Deliver in 30 - 40 min</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {lines.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySubtitle}>
                Add items from a restaurant to get started.
              </Text>
            </View>
          ) : (
            lines.map((line) => (
              <View
                key={line.lineId}
                style={styles.itemRow}
                testID={`cart-line-${line.lineId}`}
              >
                <Image
                  source={{
                    uri: urlFor(line.image).url(),
                  }}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{line.name}</Text>
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {line.description}
                  </Text>
                  <Text style={styles.itemPrice}>
                    <Currency quantity={line.price} currency="PHP" />
                  </Text>
                  {line.instructions ? (
                    <Text style={styles.instructions}>
                      Note: {line.instructions}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.qtyBox}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() =>
                      dispatch(
                        decreaseItemCount({ id: line.id })
                      )
                    }
                    testID={`cart-minus-${line.lineId}`}
                  >
                    <Text style={styles.qtyButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text
                    style={styles.qtyValue}
                    testID={`cart-qty-${line.lineId}`}
                  >
                    {line.quantity}
                  </Text>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() =>
                      dispatch(
                        increaseItemCount({
                          id: line.id,
                          lineId: line.lineId,
                          name: line.name,
                          description: line.description,
                          price: line.price,
                          image: line.image,
                        })
                      )
                    }
                    testID={`cart-plus-${line.lineId}`}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => dispatch(removeItemLine(line.lineId))}
                  testID={`cart-remove-${line.lineId}`}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalLabel}>
              <Currency quantity={cartTotal} currency="PHP" />
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery</Text>
            <Text style={styles.totalLabel}>
              <Currency quantity={DELIVERY_FEE} currency="PHP" />
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.grandLabel}>Order Total</Text>
            <Text style={styles.totalGrand}>
              <Currency quantity={grandTotal} currency="PHP" />
            </Text>
          </View>

          <TouchableOpacity
            disabled={lines.length === 0}
            onPress={() => navigation.navigate("Checkout")}
            style={[
              styles.placeOrder,
              lines.length === 0 && styles.placeOrderDisabled,
            ]}
            testID="cart-checkout-button"
          >
            <Text style={styles.placeOrderText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#F86874",
    backgroundColor: "#ffffff",
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
    marginTop: 12,
  },
  headerSubtitle: {
    textAlign: "center",
    color: "#9ca3af",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 9999,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    marginVertical: 20,
    gap: 16,
  },
  logo: {
    height: 28,
    width: 28,
    backgroundColor: "#d1d5db",
    padding: 20,
    borderRadius: 9999,
  },
  deliveryText: {
    flex: 1,
  },
  changeText: {
    color: "#F86874",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  itemImage: {
    height: 56,
    width: 56,
    backgroundColor: "#d1d5db",
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: "700",
    color: "#374151",
  },
  itemDescription: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },
  itemPrice: {
    color: "#6b7280",
    marginTop: 4,
  },
  instructions: {
    color: "#9ca3af",
    fontSize: 11,
    marginTop: 4,
    fontStyle: "italic",
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F86874",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  qtyValue: {
    color: "#374151",
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
  },
  removeText: {
    color: "#F86874",
    fontSize: 12,
    marginTop: 6,
  },
  totalsBox: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginTop: 12,
    gap: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    color: "#9ca3af",
  },
  grandLabel: {
    fontWeight: "700",
    color: "#374151",
  },
  totalGrand: {
    fontWeight: "800",
  },
  placeOrder: {
    backgroundColor: "#F86874",
    padding: 16,
    borderRadius: 8,
  },
  placeOrderDisabled: {
    backgroundColor: "#e5e7eb",
  },
  placeOrderText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyWrap: {
    padding: 40,
    alignItems: "center",
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

export default CartScreen;