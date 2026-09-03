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
  setItemQuantity,
} from "../features/itemSlice.js";
import AddOnsModal from "./AddOnsModal";
import { useSelector, useDispatch } from "react-redux";

const SAMPLE_SIZES = [
  { id: "small", label: "Small", priceDelta: 0 },
  { id: "medium", label: "Medium", priceDelta: 30 },
  { id: "large", label: "Large", priceDelta: 60 },
];

const SAMPLE_EXTRAS = [
  { id: "cheese", label: "Extra cheese", price: 25 },
  { id: "sauce", label: "Special sauce", price: 15 },
  { id: "toppings", label: "Extra toppings", price: 35 },
];

const DishRow = ({
  id,
  name,
  description,
  price,
  image,
  variant = "row",
  allowAddOns = true,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [addOnVisible, setAddOnVisible] = useState(false);
  const items = useSelector((state) => selectItemsWithId(state, id));
  const dispatch = useDispatch();

  const AddToCart = (opts = {}) => {
    const { size, extras = [], instructions = "", finalPrice } = opts;
    const lineId = `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const linePrice = typeof finalPrice === "number" ? finalPrice : price;
    dispatch(
      increaseItemCount({
        id,
        lineId,
        name,
        description,
        price: linePrice,
        image,
        size: size?.id || null,
        extras: extras.map((e) => e.id),
        instructions,
      })
    );
  };

  const updateQty = (delta) => {
    const next = items.length + delta;
    if (next <= 0) {
      dispatch(setItemQuantity({ id, quantity: 0 }));
      return;
    }
    dispatch(setItemQuantity({ id, quantity: next }));
  };

  const enriched = {
    id,
    name,
    description,
    price,
    image,
    sizes: SAMPLE_SIZES,
    extras: SAMPLE_EXTRAS,
  };

  if (variant === "card") {
    return (
      <View style={styles.cardWrap}>
        <Image source={{ uri: urlFor(image).url() }} style={styles.cardImage} />
        <Text style={styles.cardName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardPrice}>
            <Currency quantity={price} currency="PHP" />
          </Text>
          <TouchableOpacity
            onPress={() => setAddOnVisible(true)}
            style={styles.cardAddButton}
            testID={`dish-add-${id}`}
          >
            <Text style={styles.cardAddLabel}>Add</Text>
          </TouchableOpacity>
        </View>
        <AddOnsModal
          visible={addOnVisible}
          item={enriched}
          onClose={() => setAddOnVisible(false)}
          onSave={(opts) => {
            AddToCart(opts);
            setAddOnVisible(false);
          }}
        />
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsPressed(!isPressed)}
        style={[styles.header, isPressed && styles.headerPressed]}
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
            <Image style={styles.image} source={{ uri: urlFor(image).url() }} />
          </View>
        </View>
      </TouchableOpacity>

      {isPressed && (
        <View style={styles.actions}>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => updateQty(-1)}
              disabled={items.length === 0}
              testID={`dish-minus-${id}`}
            >
              <MinusCircleIcon
                size={35}
                color={items.length > 0 ? "#F86874" : "gray"}
              />
            </TouchableOpacity>
            <Text style={styles.count} testID={`dish-count-${id}`}>
              {items.length}
            </Text>
            <TouchableOpacity
              onPress={() => (allowAddOns ? setAddOnVisible(true) : updateQty(1))}
              testID={`dish-plus-${id}`}
            >
              <PlusCircleIcon size={35} color="#F86874" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <AddOnsModal
        visible={addOnVisible}
        item={enriched}
        onClose={() => setAddOnVisible(false)}
        onSave={(opts) => {
          AddToCart(opts);
          setAddOnVisible(false);
        }}
      />
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
    minWidth: 16,
    textAlign: "center",
  },
  cardWrap: {
    width: 160,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginRight: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardImage: {
    width: 144,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    marginBottom: 8,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  cardDescription: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
    minHeight: 28,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardPrice: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 12,
  },
  cardAddButton: {
    backgroundColor: "#F86874",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  cardAddLabel: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
});

export default DishRow;