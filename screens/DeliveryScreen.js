import {
  View,
  Text,
  SafeAreaView,
  Image,
  Linking,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectRestaurant } from "../features/restaurantSlice";
import { selectItemsTotal } from "../features/itemSlice";
import { TouchableOpacity as GHTouchableOpacity } from "react-native-gesture-handler";
import { XIcon } from "react-native-heroicons/solid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Currency from "../components/Currency";

const TIP_STORAGE_KEY = "oh-delivery:last-tip";

let MapView = null;
let Marker = null;
if (Platform.OS !== "web") {
  try {
    const Maps = require("react-native-maps");
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch (e) {
    MapView = null;
  }
}

const TIP_OPTIONS = [
  { id: "ten", label: "10%", value: 0.1, type: "percent" },
  { id: "fifteen", label: "15%", value: 0.15, type: "percent" },
  { id: "twenty", label: "20%", value: 0.2, type: "percent" },
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
  const dispatch = useDispatch();
  const restaurant = useSelector(selectRestaurant);
  const cartTotal = useSelector(selectItemsTotal);
  const [selectedTipId, setSelectedTipId] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS !== "web") {
          const raw = await AsyncStorage.getItem(TIP_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.id) {
              setSelectedTipId(parsed.id);
            }
            if (parsed?.customAmount) {
              setCustomAmount(String(parsed.customAmount));
              setCustomMode(parsed.id === "custom");
            }
          }
        }
      } catch (e) {
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (Platform.OS === "web") return;
    AsyncStorage.setItem(
      TIP_STORAGE_KEY,
      JSON.stringify({ id: selectedTipId, customAmount })
    ).catch(() => {});
  }, [selectedTipId, customAmount, hydrated]);

  const selectedTip = useMemo(
    () => TIP_OPTIONS.find((t) => t.id === selectedTipId) || null,
    [selectedTipId]
  );

  const tipAmount = selectedTip
    ? cartTotal * selectedTip.value
    : customMode && customAmount && !Number.isNaN(parseFloat(customAmount))
    ? parseFloat(customAmount)
    : 0;

  const handleSelectTip = (option) => {
    setSelectedTipId((current) =>
      current === option.id ? null : option.id
    );
    setCustomMode(false);
  };

  const handleEnableCustom = () => {
    setSelectedTipId(null);
    setCustomMode(true);
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
        </View>
      </SafeAreaView>

      {Platform.OS === "web" || !MapView ? (
        <WebMapPlaceholder restaurant={restaurant} />
      ) : (
        <MapView
          initialRegion={{
            latitude: restaurant?.lat || 14.5995,
            longitude: restaurant?.long || 120.9842,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          style={styles.map}
          mapType="mutedStandard"
        >
          <Marker
            coordinate={{
              latitude: restaurant?.lat || 14.5995,
              longitude: restaurant?.long || 120.9842,
            }}
            title={restaurant?.title}
            description={restaurant?.short_description}
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
              const isSelected = option.id === selectedTipId && !customMode;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleSelectTip(option)}
                  style={[
                    styles.tipOption,
                    isSelected && styles.tipOptionSelected,
                  ]}
                  testID={`tip-${option.id}`}
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
            <TouchableOpacity
              onPress={handleEnableCustom}
              style={[
                styles.tipOption,
                customMode && styles.tipOptionSelected,
              ]}
              testID="tip-custom"
            >
              <Text
                style={[
                  styles.tipOptionLabel,
                  customMode && styles.tipOptionLabelSelected,
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
          {customMode ? (
            <View style={styles.customRow}>
              <TextInput
                style={styles.customInput}
                placeholder="Amount"
                keyboardType="number-pad"
                value={customAmount}
                onChangeText={setCustomAmount}
                testID="tip-custom-input"
              />
              <Text style={styles.customCurrency}>PHP</Text>
            </View>
          ) : null}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tip amount</Text>
            <Text style={styles.summaryValue}>
              <Currency quantity={tipAmount} currency="PHP" />
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order total</Text>
            <Text style={styles.summaryValue}>
              <Currency quantity={cartTotal + tipAmount} currency="PHP" />
            </Text>
          </View>
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
  customRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  customCurrency: {
    color: "#6b7280",
    fontWeight: "700",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  summaryLabel: {
    color: "#6b7280",
  },
  summaryValue: {
    fontWeight: "700",
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