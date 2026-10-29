module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo|react-native-gesture-handler|react-native-reanimated|@testing-library/react-native|@react-native-community|@react-native-async-storage|@reduxjs/toolkit|redux|@types|react|react-dom|react-redux|axios|prop-types|moment|tslib|@babel|metro|metro-react-native-babel-preset|react-native-safe-area-context|react-native-screens|react-native-svg|react-native-heroicons|react-native-paper|react-native-ratings|react-native-progress|react-native-maps|react-native-web|react-native-webview|react-native-loading-spinner-overlay|@fortawesome|remote-redux-devtools|redux-devtools-extension|redux-thunk|jest-expo|jest|ts-jest|babel-preset-expo|@types|typescript|@react-native|@react-native-community|@react-native-async-storage|@react-navigation|expo-modules-core|expo-constants|expo-file-system|expo-font|expo-keep-awake|expo-linking|expo-modules-autolinking|expo-splash-screen|expo-status-bar|expo-updates|@react-native-community/cli|@react-native-community/cli-platform-ios|@react-native-community/cli-platform-android|@react-native-community/netinfo|@react-native-community/push-notification-ios|@react-native-community/viewpager|@sentry|@segment|@shopify|@stripe|@tanstack|@testing-library|@trpc|@types|@vue)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^test-renderer$': '<rootDir>/__mocks__/test-renderer.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'screens/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    'features/**/*.{js,jsx,ts,tsx}',
  ],
};