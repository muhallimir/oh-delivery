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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Restaurant" component={RestaurantScreen} />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              headerShown: false,
              presentation: "modal",
            }}
          >
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen
              name="PrepareOrder"
              component={PreparingOrderScreen}
            />
            <Stack.Screen name="Delivery" component={DeliveryScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}