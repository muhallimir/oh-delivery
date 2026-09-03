# Oh Delivery

A food delivery app built with Expo and React Native. Browse featured restaurants, view menus, add dishes to a cart, and track the order from preparation through rider delivery.

## Screens

- Home: search, cuisine categories, and horizontally scrollable featured restaurant rows fetched from Sanity.
- Restaurant: hero image, ratings, address, full menu with dish rows.
- Cart: review the current order, adjust quantities, see the subtotal, and place the order.
- PrepareOrder: animated loading screen shown briefly while the order is accepted.
- Delivery: arrival estimate, progress bar, map preview, and a call button for the rider.

## Tech Stack

- Expo SDK 54
- React Native 0.81
- React 19
- React Navigation v7 (native and stack)
- Redux Toolkit and react-redux for cart and restaurant state
- react-native-maps for the delivery map preview (iOS and Android only)
- react-native-heroicons for the icon set
- react-native-progress for the loading and delivery progress bars
- react-native-svg for vector primitives
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
screens/                Screen components (Home, Restaurant, Cart, PrepareOrder, Delivery)
components/             Shared presentational components
features/               Redux Toolkit slices (cart, restaurant)
sanity/                 Sanity Studio project (schemas and config)
assets/                 Static images and icons
```

## License

MIT, by Amirsali.
