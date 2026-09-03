import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { selectItems, selectItemsTotal } from "../features/itemSlice";
import { useNavigation } from "@react-navigation/native";
import Currency from "./Currency";

const CartIcon = () => {
  const items = useSelector(selectItems);
  const navigation = useNavigation();
  const cartTotal = useSelector(selectItemsTotal);
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Cart")}
        style={styles.button}
      >
        <Text style={styles.count}>{items.length}</Text>

        <Text style={styles.label}>View Cart</Text>

        <Text style={styles.total}>
          <Currency quantity={cartTotal} currency="PHP" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 48,
    width: "100%",
    zIndex: 50,
  },
  button: {
    marginHorizontal: 20,
    backgroundColor: "#F86874",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  count: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 18,
    backgroundColor: "#6b7280",
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  label: {
    flex: 1,
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 18,
    textAlign: "center",
  },
  total: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "800",
  },
});

export default CartIcon;