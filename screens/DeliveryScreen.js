import {
  View,
  Text,
  SafeAreaView,
  Image,
  Linking,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectRestaurant } from "../features/restaurantSlice";
import { selectItemsTotal } from "../features/itemSlice";
import { TouchableOpacity as GHTouchableOpacity } from "react-native-gesture-handler";
import { XIcon } from "react-native-heroicons/solid";
import * as Progress from "react-native-progress";
import Currency from "../components/Currency";

let MapView = null;
let Marker = null;
if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
}

const TIP_OPTIONS = [
  { id: "ten", label: "10%", value: 0.1 },
  { id: "fifteen", label: "15%", value: 0.15 },
  { id: "twenty", label: "20%", value: 0.2 },
];

const WebMapPlaceholder = ({ restaurant }) => (
  <View style={styles.webMapFallback}>
    <Text style={styles.webMapTitle}>{restaurant?.title || "Restaurant"}</Text>
    <Text style={styles.webMapHint}>
      Map preview is available on iOS and Android. Open the Expo Go app to view
      live tracking.
    </Text>
  </View>
);

const DeliveryScreen = () => {
  const navigation = useNavigation();
  const restaurant = useSelector(selectRestaurant);
  const cartTotal = useSelector(selectItemsTotal);
  const [selectedTipId, setSelectedTipId] = useState(null);

  const selectedTip = useMemo(
    () => TIP_OPTIONS.find((t) => t.id === selectedTipId) || null,
    [selectedTipId]
  );

  const tipAmount = selectedTip ? cartTotal * selectedTip.value : 0;

  const handleSelectTip = (option) => {
    setSelectedTipId((current) =>
      current === option.id ? null : option.id
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topSafeArea}>
        <View style={styles.topBar}>
          <Text style={styles.helpText}>Order Help</Text>
          <GHTouchableOpacity onPress={() => navigation.navigate("Home")}>
            <XIcon color={"#fff"} size={30} />
          </GHTouchableOpacity>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.arrivalLabel}>Estimated Arrival</Text>
              <Text style={styles.arrivalTime}>30 -35 Minutes</Text>
            </View>
            <Image
              source={require("../assets/images/rider.gif")}
              style={styles.riderImage}
            />
          </View>
          <Progress.Bar size={30} indeterminate={true} color={"#cd6465"} />
          <Text style={styles.statusHint}>
            Your order is on the way. Almost there!
          </Text>
        </View>
      </SafeAreaView>

      {Platform.OS === "web" || !MapView ? (
        <WebMapPlaceholder restaurant={restaurant} />
      ) : (
        <MapView
          initialRegion={{
            latitude: restaurant.lat,
            longitude: restaurant.long,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          style={styles.map}
          mapType="mutedStandard"
        >
          <Marker
            coordinate={{
              latitude: restaurant.lat,
              longitude: restaurant.long,
            }}
            title={restaurant.title}
            description={restaurant.short_description}
            identifier="origin"
            pinColor="#cd6465"
          />
        </MapView>
      )}

      <SafeAreaView style={styles.bottomBar}>
        <View style={styles.tipCard}>
          <Text style={styles.tipHeading}>Tip your rider</Text>
          <Text style={styles.tipSub}>
            Show appreciation for great service.
          </Text>
          <View style={styles.tipRow}>
            {TIP_OPTIONS.map((option) => {
              const isSelected = option.id === selectedTipId;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleSelectTip(option)}
                  style={[
                    styles.tipOption,
                    isSelected && styles.tipOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.tipOptionLabel,
                      isSelected && styles.tipOptionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedTip ? (
            <Text style={styles.tipAdded}>
              Tip added: <Currency quantity={tipAmount} currency="PHP" />
            </Text>
          ) : (
            <Text style={styles.tipHint}>
              Tap a tip option to add a tip to your order.
            </Text>
          )}
        </View>

        <View style={styles.riderBar}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.bottomLogo}
          />
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>Amir Muhalli</Text>
            <Text style={styles.riderRole}>Your Rider</Text>
          </View>
          <GHTouchableOpacity
            onPress={() => Linking.openURL("https://portf-amir23.web.app")}
          >
            <Text style={styles.callText}>Call</Text>
          </GHTouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cd6465",
  },
  topSafeArea: {
    zIndex: 50,
    top: 40,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  helpText: {
    fontWeight: "300",
    color: "#ffffff",
    fontSize: 18,
  },
  statusCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 6,
    padding: 24,
    zIndex: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  arrivalLabel: {
    fontSize: 18,
    color: "#9ca3af",
  },
  arrivalTime: {
    fontSize: 28,
    fontWeight: "700",
    top: 8,
  },
  riderImage: {
    height: 80,
    width: 80,
    top: 4,
  },
  statusHint: {
    marginTop: 12,
    color: "#6b7280",
  },
  map: {
    flex: 1,
    marginTop: -40,
    zIndex: 0,
  },
  webMapFallback: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    marginTop: -40,
    zIndex: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  webMapTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  webMapHint: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  bottomBar: {
    backgroundColor: "#ffffff",
  },
  tipCard: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    gap: 8,
  },
  tipHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  tipSub: {
    color: "#6b7280",
    fontSize: 12,
  },
  tipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  tipOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  tipOptionSelected: {
    borderColor: "#F86874",
    backgroundColor: "#fff1f2",
  },
  tipOptionLabel: {
    fontWeight: "700",
    color: "#374151",
  },
  tipOptionLabelSelected: {
    color: "#F86874",
  },
  tipAdded: {
    marginTop: 8,
    color: "#F86874",
    fontWeight: "700",
    fontSize: 14,
  },
  tipHint: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 12,
  },
  riderBar: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    gap: 20,
  },
  bottomLogo: {
    height: 48,
    width: 48,
    backgroundColor: "#d1d5db",
    padding: 16,
    borderRadius: 9999,
    marginLeft: 20,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 18,
  },
  riderRole: {
    color: "#9ca3af",
  },
  callText: {
    color: "#F86874",
    fontSize: 18,
    marginRight: 20,
    fontWeight: "700",
  },
});

export default DeliveryScreen;
