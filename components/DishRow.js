import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import Currency from "./Currency";
import { urlFor } from "../sanity";
import React, { useState } from "react";
import { MinusCircleIcon, PlusCircleIcon } from "react-native-heroicons/solid";
import {
  increaseItemCount,
  selectItemsWithId,
  decreaseItemCount,
} from "../features/itemSlice.js";
import { useSelector, useDispatch } from "react-redux";

const DishRow = ({ id, name, description, price, image }) => {
  const [isPressed, setIsPressed] = useState(false);
  const items = useSelector((state) => selectItemsWithId(state, id));
  const dispatch = useDispatch();

  const AddToCart = () => {
    dispatch(increaseItemCount({ id, name, description, price, image }));
  };

  const removeFromCart = () => {
    if (!items.length > 0) return;
    dispatch(decreaseItemCount({ id }));
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setIsPressed(!isPressed);
        }}
        style={[
          styles.header,
          isPressed && styles.headerPressed,
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.price}>
              <Currency quantity={price} currency="PHP" />
            </Text>
          </View>
          <View>
            <Image
              style={styles.image}
              source={{ uri: urlFor(image).url() }}
            />
          </View>
        </View>
      </TouchableOpacity>

      {isPressed && (
        <View style={styles.actions}>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={removeFromCart}
              disabled={items.length === 0}
            >
              <MinusCircleIcon
                size={35}
                color={items.length > 0 ? "#F86874" : "gray"}
              />
            </TouchableOpacity>
            <Text style={styles.count}>{items.length}</Text>
            <TouchableOpacity onPress={AddToCart}>
              <PlusCircleIcon size={35} color="#F86874" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    padding: 16,
    borderColor: "#e5e7eb",
  },
  headerPressed: {
    borderBottomWidth: 0,
  },
  headerRow: {
    flexDirection: "row",
  },
  info: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    color: "#9ca3af",
  },
  price: {
    color: "#9ca3af",
    marginTop: 8,
  },
  image: {
    height: 80,
    width: 80,
    backgroundColor: "#d1d5db",
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F3F4",
  },
  actions: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    gap: 8,
  },
  count: {
    color: "#6b7280",
  },
});

export default DishRow;