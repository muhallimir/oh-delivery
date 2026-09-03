import { SafeAreaView, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import * as Animatable from "react-native-animatable";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";

const PreparingOrderScreen = () => {
  const navigation = useNavigation();
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