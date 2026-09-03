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
  addCard,
  addCash,
  removeMethod,
  selectPaymentMethods,
  setDefaultMethod,
} from "../features/paymentSlice";

const PaymentMethodsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const methods = useSelector(selectPaymentMethods);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const reset = () => {
    setNumber("");
    setName("");
    setExpiry("");
    setCvc("");
  };

  const handleAddCard = () => {
    if (!number || !name) {
      Alert.alert("Missing info", "Card number and holder name are required.");
      return;
    }
    const result = dispatch(
      addCard({
        number: String(number).replace(/\s+/g, ""),
        name,
        expiry,
        cvc,
      })
    );
    if (!result?.payload?.ok) {
      Alert.alert(
        "Invalid card",
        "Card number failed validation. Try 4242 4242 4242 4242."
      );
      return;
    }
    reset();
    Alert.alert("Card added", "Your card was saved.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment methods</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          testID="payment-close"
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionTitle}>Add a card</Text>
        <TextInput
          style={styles.input}
          placeholder="Card number"
          keyboardType="number-pad"
          value={number}
          onChangeText={setNumber}
          testID="card-number-input"
        />
        <TextInput
          style={styles.input}
          placeholder="Cardholder name"
          value={name}
          onChangeText={setName}
          testID="card-name-input"
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.flex1]}
            placeholder="MM/YY"
            value={expiry}
            onChangeText={setExpiry}
          />
          <TextInput
            style={[styles.input, styles.flex1]}
            placeholder="CVC"
            keyboardType="number-pad"
            value={cvc}
            onChangeText={setCvc}
            secureTextEntry
          />
        </View>
        <Text style={styles.helper}>
          Try 4242 4242 4242 4242 for a successful test card.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleAddCard}
          testID="add-card-button"
        >
          <Text style={styles.primaryButtonText}>Add card</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.secondaryButton]}
            onPress={() => dispatch(addCash())}
            testID="add-cash-button"
          >
            <Text style={styles.secondaryButtonText}>
              Enable cash on delivery
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Saved methods</Text>
        {methods.length === 0 ? (
          <Text style={styles.empty}>No payment methods yet.</Text>
        ) : (
          methods.map((m) => (
            <View key={m.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardLabel}>
                  {m.type === "cash" ? m.label : `${m.brand} ${m.masked}`}
                </Text>
                {m.type === "card" ? (
                  <Text style={styles.cardSub}>{m.name}</Text>
                ) : null}
              </View>
              <View style={styles.actions}>
                {m.id !== "cash-default" ? (
                  <TouchableOpacity
                    onPress={() => dispatch(setDefaultMethod(m.id))}
                    testID={`set-default-${m.id}`}
                  >
                    <Text style={styles.actionText}>Set default</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  onPress={() => dispatch(removeMethod(m.id))}
                  testID={`remove-method-${m.id}`}
                >
                  <Text style={[styles.actionText, styles.dangerText]}>
                    Remove
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
  helper: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: "#F86874",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  buttonRow: {
    marginTop: 8,
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "700",
  },
  empty: {
    color: "#9ca3af",
    paddingVertical: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 8,
  },
  cardLabel: {
    fontWeight: "700",
    color: "#374151",
  },
  cardSub: {
    color: "#9ca3af",
    fontSize: 12,
  },
  actions: {
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

export default PaymentMethodsScreen;