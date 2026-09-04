import { Platform, Alert } from "react-native";

let Notifications = null;
try {
  Notifications = require("expo-notifications");
  if (Notifications && Notifications.setNotificationHandler) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }
} catch (e) {
  Notifications = null;
}

const SCHEDULE = [
  { delay: 5000, title: "Order confirmed", body: "Your order has been received." },
  {
    delay: 15000,
    title: "Preparing your food",
    body: "The kitchen is working on your order.",
  },
  {
    delay: 30000,
    title: "Out for delivery",
    body: "Your rider is on the way to your address.",
  },
  {
    delay: 60000,
    title: "Delivered",
    body: "Your order has been delivered. Enjoy!",
  },
];

const timers = new Map();

export const ensurePermissions = async () => {
  if (!Notifications) return false;
  if (Platform.OS === "web") return false;
  try {
    const settings = await Notifications.getPermissionsAsync();
    if (
      settings &&
      settings.granted === false &&
      settings.ios?.status !== 3
    ) {
      await Notifications.requestPermissionsAsync();
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const cancelOrderNotifications = (orderId) => {
  const list = timers.get(orderId);
  if (list && Array.isArray(list)) {
    list.forEach((t) => clearTimeout(t));
  }
  timers.delete(orderId);
};

const scheduleInApp = (orderId, title, body) => {
  const id = setTimeout(() => {
    Alert.alert(title, body);
  }, 0);
  return id;
};

export const scheduleOrderStatusNotifications = async (orderId) => {
  cancelOrderNotifications(orderId);
  if (!orderId) return;
  const list = [];

  for (const step of SCHEDULE) {
    if (Notifications && Platform.OS !== "web") {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: step.title,
            body: step.body,
            data: { orderId, status: step.title },
          },
          trigger: { seconds: Math.max(1, Math.floor(step.delay / 1000)) },
        });
      } catch (e) {
        const id = scheduleInApp(orderId, step.title, step.body);
        list.push(id);
      }
    } else {
      const id = setTimeout(() => {
        Alert.alert(step.title, step.body);
      }, step.delay);
      list.push(id);
    }
  }

  timers.set(orderId, list);
};

export const notifyImmediate = async (title, body) => {
  if (Notifications && Platform.OS !== "web") {
    try {
      await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: null,
      });
      return;
    } catch (e) {
    }
  }
  Alert.alert(title, body);
};