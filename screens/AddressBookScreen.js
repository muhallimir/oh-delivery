import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  removeAddress,
  setDefaultAddress,
  selectAddresses,
  updateAddress,
} from "../features/addressesSlice";

const LABEL_OPTIONS = ["Home", "Work", "Other"];

const AddressBookScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const addresses = useSelector(selectAddresses);
  const [editing, setEditing] = useState(null);
  const [label, setLabel] = useState("Home");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("Philippines");

  const reset = () => {
    setEditing(null);
    setLabel("Home");
    setStreet("");
    setCity("");
    setPostal("");
    setCountry("Philippines");
  };

  const startEdit = (addr) => {
    setEditing(addr.id);
    setLabel(addr.label || "Home");
    setStreet(addr.street || "");
    setCity(addr.city || "");
    setPostal(addr.postal || "");
    setCountry(addr.country || "Philippines");
  };

  const handleSave = () => {
    if (!street || !city) {
      Alert.alert("Missing info", "Street and city are required.");
      return;
    }
    const lat = 14.5995 + (Math.random() - 0.5) * 0.05;
    const long = 120.9842 + (Math.random() - 0.5) * 0.05;
    const payload = {
      label,
      street,
      city,
      postal,
      country,
      lat,
      long,
    };
    if (editing) {
      dispatch(updateAddress({ id: editing, ...payload }));
    } else {
      dispatch(addAddress(payload));
    }
    reset();
  };

  const handleRemove = (id) => {
    Alert.alert("Remove address", "Delete this saved address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(removeAddress(id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Address book</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          testID="address-book-close"
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionTitle}>
          {editing ? "Edit address" : "Add address"}
        </Text>
        <View style={styles.labelRow}>
          {LABEL_OPTIONS.map((l) => (
            <TouchableOpacity
              key={l}
              testID={`label-${l}`}
              onPress={() => setLabel(l)}
              style={[styles.labelChip, label === l && styles.labelChipActive]}
            >
              <Text
                style={[
                  styles.labelChipText,
                  label === l && styles.labelChipTextActive,
                ]}
              >
                {l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Street"
          value={street}
          onChangeText={setStreet}
          testID="address-street-input"
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex1]}
            placeholder="City"
            value={city}
            onChangeText={setCity}
            testID="address-city-input"
          />
          <TextInput
            style={[styles.input, styles.flex1]}
            placeholder="Postal"
            value={postal}
            onChangeText={setPostal}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
        />
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapHint}>
            Pick location on map (mocked). Latitude: 14.5995, Longitude: 120.9842
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={reset}
          >
            <Text style={styles.secondaryButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSave}
            testID="address-save-button"
          >
            <Text style={styles.primaryButtonText}>
              {editing ? "Update" : "Save"} address
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Saved addresses</Text>
        {addresses.length === 0 ? (
          <Text style={styles.empty}>No saved addresses yet.</Text>
        ) : (
          addresses.map((addr) => (
            <View key={addr.id} style={styles.addrCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.addrLabel}>
                  {addr.label}
                  {addr.isDefault ? " (default)" : ""}
                </Text>
                <Text style={styles.addrText}>{addr.street}</Text>
                <Text style={styles.addrText}>
                  {addr.city} {addr.postal} . {addr.country}
                </Text>
              </View>
              <View style={styles.addrActions}>
                <TouchableOpacity
                  onPress={() => startEdit(addr)}
                  testID={`address-edit-${addr.id}`}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                {!addr.isDefault ? (
                  <TouchableOpacity
                    onPress={() => dispatch(setDefaultAddress(addr.id))}
                    testID={`address-default-${addr.id}`}
                  >
                    <Text style={styles.actionText}>Set default</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  onPress={() => handleRemove(addr.id)}
                  testID={`address-remove-${addr.id}`}
                >
                  <Text style={[styles.actionText, styles.dangerText]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#F86874",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 20,
  },
  closeText: {
    color: "#F86874",
    fontWeight: "700",
  },
  body: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#374151",
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  labelChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 8,
  },
  labelChipActive: {
    backgroundColor: "#F86874",
    borderColor: "#F86874",
  },
  labelChipText: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 12,
  },
  labelChipTextActive: {
    color: "#ffffff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  flex1: {
    flex: 1,
    marginRight: 8,
  },
  mapPlaceholder: {
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  mapHint: {
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#F86874",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "700",
  },
  empty: {
    color: "#9ca3af",
    paddingVertical: 16,
  },
  addrCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 8,
  },
  addrLabel: {
    fontWeight: "700",
    color: "#374151",
  },
  addrText: {
    color: "#6b7280",
    fontSize: 12,
  },
  addrActions: {
    gap: 4,
    alignItems: "flex-end",
  },
  actionText: {
    color: "#F86874",
    fontWeight: "700",
    fontSize: 12,
  },
  dangerText: {
    color: "#dc2626",
  },
});

export default AddressBookScreen;