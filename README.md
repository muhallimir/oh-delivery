# Oh Delivery

A food delivery app built with Expo and React Native. Browse featured restaurants, view menus grouped by category, customize dishes with add-ons, manage saved addresses and payment methods, and track orders live with a simulated rider.

## Screens

- Home: search, cuisine categories, cuisine and dietary filters, and horizontally scrollable featured restaurant rows fetched from Sanity.
- Restaurant: hero image, ratings, address, menu grouped into Starters, Mains, Drinks, and Desserts with search, plus a submit-review form.
- Cart: per-line quantity controls, special instructions, and live subtotal with delivery fee.
- Checkout: three-step flow (delivery address, payment method, review with tip selector) that places the order.
- OrderTracking: live map with a simulated rider that moves every five seconds, status timeline, and call/message actions.
- DeliveryRating: five-star rating for delivery and food with optional feedback, shown after delivery.
- OrderHistory: list of past orders with reorder and tap-to-detail.
- OrderDetail: item list, totals, status timeline, and reorder.
- Favorites: grid of saved restaurants with empty state and remove actions.
- AddressBook: add, edit, delete, and set default addresses.
- PaymentMethods: add cards (Luhn validation) and toggle cash on delivery.

## Tech Stack

- Expo SDK 54
- React Native 0.81
- React 19
- React Navigation v7 (native and stack)
- Redux Toolkit and react-redux for cart, restaurant, favorites, orders, reviews, addresses, payment, and filter state
- react-native-maps for the delivery map preview (iOS and Android only)
- expo-notifications for order status push notifications
- react-native-heroicons for the icon set
- react-native-progress for loading bars
- AsyncStorage for local persistence
- Sanity CMS for restaurants, dishes, categories, and featured rows

## Run

Install dependencies:

```
npm install
```

Start the development server:

```
npm run start
```

Run on a specific platform:

```
npm run ios
npm run android
npm run web
```

The web bundle lives in `dist/`. To produce a fresh production bundle for the web:

```
npm run build:web
```

To re-render native iOS and Android projects after editing `app.json`, run `npx expo prebuild`. The `ios/` and `android/` folders are intentionally gitignored, so a fresh prebuild is expected after a clean checkout.

## Project Structure

```
App.js                  NavigationContainer and stack navigator
store.js                Redux store wiring
app.json                Expo configuration
sanity.js               Sanity client and image URL builder
screens/                Screen components
components/             Shared presentational components
features/               Redux Toolkit slices
utils/                  Helpers (notifications, dietary tags)
sanity/                 Sanity Studio project (schemas and config)
assets/                 Static images and icons
.maestro/               Maestro UI test flow
```

## UI Tests

Maestro flows live in `.maestro/`. The environment is set up by sourcing the helper script:

```
. .maestro/env.sh
```

Run the extended home flow:

```
$MAESTRO_CLI_NO_ANALYTICS=1 maestro test .maestro/home-flow.yaml
```

## License

MIT, by Amirsali.