const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Sanity's live listener pulls in Node's `url` module via `eventsource`.
// React Native does not ship `url`, so Metro fails to bundle the chain even
// though we never call the listener. Alias `eventsource` to a no-op shim.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "eventsource") {
    return {
      filePath: require.resolve("./shims/eventsource-stub.js"),
      type: "sourceFile",
    };
  }
  if (typeof originalResolveRequest === "function") {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;