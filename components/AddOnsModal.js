import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";

const AddOnsModal = ({ visible, item, onClose, onSave }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [instructions, setInstructions] = useState("");

  const sizes = item?.sizes || [];
  const extras = item?.extras || [];

  useEffect(() => {
    if (visible) {
      setSelectedSize(sizes[0] || null);
      setSelectedExtras([]);
      setInstructions("");
    }
  }, [visible]);

  const toggleExtra = (extra) => {
    setSelectedExtras((current) =>
      current.find((c) => c.id === extra.id)
        ? current.filter((c) => c.id !== extra.id)
        : [...current, extra]
    );
  };

  const extrasTotal = selectedExtras.reduce((acc, e) => acc + (e.price || 0), 0);
  const sizeDelta = selectedSize ? selectedSize.priceDelta || 0 : 0;
  const basePrice = item?.price || 0;
  const finalPrice = basePrice + sizeDelta + extrasTotal;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{item?.name || "Customize"}</Text>
          <Text style={styles.basePrice}>Base: {basePrice.toFixed(2)}</Text>

          {sizes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Size</Text>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  style={styles.row}
                  onPress={() => setSelectedSize(size)}
                  testID={`size-${size.id}`}
                >
                  <View
                    style={[
                      styles.radio,
                      selectedSize?.id === size.id && styles.radioActive,
                    ]}
                  />
                  <Text style={styles.rowLabel}>{size.label}</Text>
                  {size.priceDelta ? (
                    <Text style={styles.rowPrice}>
                      +{(size.priceDelta || 0).toFixed(2)}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {extras.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add extras</Text>
              {extras.map((extra) => {
                const checked = selectedExtras.find((e) => e.id === extra.id);
                return (
                  <TouchableOpacity
                    key={extra.id}
                    style={styles.row}
                    onPress={() => toggleExtra(extra)}
                    testID={`extra-${extra.id}`}
                  >
                    <View
                      style={[styles.checkbox, checked && styles.checkboxActive]}
                    >
                      {checked ? <Text style={styles.check}>✓</Text> : null}
                    </View>
                    <Text style={styles.rowLabel}>{extra.label}</Text>
                    <Text style={styles.rowPrice}>
                      +{(extra.price || 0).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special instructions</Text>
            <TextInput
              style={styles.instructions}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="e.g. no onions, extra spicy"
              multiline
              testID="special-instructions-input"
            />
          </View>

          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Item total</Text>
              <Text style={styles.summaryValue}>{finalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                testID="addons-cancel"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() =>
                  onSave({
                    size: selectedSize,
                    extras: selectedExtras,
                    instructions,
                    finalPrice,
                  })
                }
                testID="addons-confirm"
              >
                <Text style={styles.confirmText}>Add to cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },
  basePrice: {
    color: "#9ca3af",
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 8,
    color: "#374151",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  radioActive: {
    borderColor: "#F86874",
    backgroundColor: "#F86874",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#F86874",
    borderColor: "#F86874",
  },
  check: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  rowLabel: {
    flex: 1,
    color: "#374151",
  },
  rowPrice: {
    color: "#6b7280",
  },
  instructions: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 8,
    minHeight: 60,
    textAlignVertical: "top",
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingTop: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontWeight: "700",
    color: "#374151",
  },
  summaryValue: {
    fontWeight: "700",
    color: "#F86874",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  confirmButton: {
    backgroundColor: "#F86874",
  },
  cancelText: {
    fontWeight: "700",
    color: "#374151",
  },
  confirmText: {
    fontWeight: "700",
    color: "#ffffff",
  },
});

export default AddOnsModal;