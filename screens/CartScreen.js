import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { selectRestaurant } from "../features/restaurantSlice";
import {
  decreaseItemCount,
  selectItems,
  selectItemsTotal,
} from "../features/itemSlice";
import { XCircleIcon } from "react-native-heroicons/solid";
import logo from "../assets/images/logo.png";
import { ScrollView } from "react-native-gesture-handler";
import { urlFor } from "../sanity";
import Currency from "../components/Currency";

const CartScreen = () => {
  const navigation = useNavigation();
  const restaurant = useSelector(selectRestaurant);
  const cartTotal = useSelector(selectItemsTotal);
  const items = useSelector(selectItems);
  const dispatch = useDispatch();
  const [groupedItemsInCart, setGroupedItemsInCart] = useState([]);

  useEffect(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});
    setGroupedItemsInCart(groupedItems);
  }, [items]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Current items</Text>
            <Text style={styles.headerSubtitle}>{restaurant.title}</Text>
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
          {Object.entries(groupedItemsInCart).map(([key, items]) => (
            <View key={key} style={styles.itemRow}>
              <Text style={styles.itemQty}>{items.length} x</Text>

              <Image
                source={{
                  uri: urlFor(items[0]?.image).url(),
                }}
                style={styles.itemImage}
              />

              <Text style={styles.itemName}>{items[0]?.name}</Text>
              <Text style={styles.itemPrice}>
                <Currency quantity={items[0]?.price} currency="PHP" />
              </Text>
              <TouchableOpacity>
                <Text
                  style={styles.removeText}
                  onPress={() => dispatch(decreaseItemCount({ id: key }))}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalLabel}>
              <Currency quantity={cartTotal} currency="PHP" />
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Deliver</Text>
            <Text style={styles.totalLabel}>
              <Currency quantity={74} currency="PHP" />
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text>Order Total</Text>
            <Text style={styles.totalGrand}>
              <Currency quantity={cartTotal + 74} currency="PHP" />
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("PrepareOrder")}
            style={styles.placeOrder}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
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
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  itemQty: {
    color: "#F86874",
  },
  itemImage: {
    height: 48,
    width: 48,
    backgroundColor: "#d1d5db",
    borderRadius: 9999,
  },
  itemName: {
    flex: 1,
  },
  itemPrice: {
    color: "#4b5563",
  },
  removeText: {
    color: "#F86874",
    fontSize: 12,
  },
  totalsBox: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginTop: 20,
    gap: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    color: "#9ca3af",
  },
  totalGrand: {
    fontWeight: "800",
  },
  placeOrder: {
    backgroundColor: "#F86874",
    padding: 16,
    borderRadius: 8,
  },
  placeOrderText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default CartScreen;