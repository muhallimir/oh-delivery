import { SafeAreaView, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import * as Animatable from "react-native-animatable";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectItemsTotal, selectItems } from "../features/itemSlice";
import { selectRestaurant } from "../features/restaurantSlice";
import { addOrder } from "../features/ordersSlice";

const DELIVERY_FEE = 74;

const PreparingOrderScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartTotal = useSelector(selectItemsTotal);
  const items = useSelector(selectItems);
  const restaurant = useSelector(selectRestaurant);
  const dispatchedRef = useRef(false);

  useEffect(() => {
    if (!dispatchedRef.current && cartTotal > 0) {
      dispatchedRef.current = true;
      const order = {
        id: `${Date.now()}`,
        placedAt: new Date().toISOString(),
        restaurantTitle: restaurant?.title || null,
        restaurantId: restaurant?.id || null,
        itemCount: items.length,
        subtotal: cartTotal,
        deliveryFee: DELIVERY_FEE,
        total: cartTotal + DELIVERY_FEE,
        status: "preparing",
      };
      dispatch(addOrder(order));
    }
  }, [dispatch, cartTotal, items.length, restaurant]);

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Delivery");
    }, 3500);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animatable.Image
        source={require("../assets/images/preparing.gif")}
        style={styles.image}
        animation="slideInUp"
        iterationCount={1}
        easing="ease-in-out"
      />
      <Animatable.Text
        animation="slideInUp"
        iterationCount={1}
        style={styles.message}
      >
        Your order is being prepared. Please wait.
      </Animatable.Text>

      <Progress.Bar
        animationType="spring"
        size={60}
        indeterminate={true}
        color="white"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#cd6465",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 280,
    width: 280,
  },
  message: {
    color: "#ffffff",
    fontWeight: "800",
    bottom: 80,
  },
});

export default PreparingOrderScreen;
