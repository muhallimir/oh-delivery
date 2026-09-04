import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import RestaurantScreen from "./screens/RestaurantScreen";
import { Provider } from "react-redux";
import { store } from "./store";
import CartScreen from "./screens/CartScreen";
import "react-native-gesture-handler";
import PreparingOrderScreen from "./screens/PreparingOrderScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import OrderTrackingScreen from "./screens/OrderTrackingScreen";
import OrderDetailScreen from "./screens/OrderDetailScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import AddressBookScreen from "./screens/AddressBookScreen";
import PaymentMethodsScreen from "./screens/PaymentMethodsScreen";
import DeliveryRatingScreen from "./screens/DeliveryRatingScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Restaurant" component={RestaurantScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="AddressBook" component={AddressBookScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              headerShown: false,
              presentation: "modal",
            }}
          >
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen
              name="PrepareOrder"
              component={PreparingOrderScreen}
            />
            <Stack.Screen name="Delivery" component={DeliveryScreen} />
            <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
            <Stack.Screen
              name="DeliveryRating"
              component={DeliveryRatingScreen}
            />
          </Stack.Group>
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}