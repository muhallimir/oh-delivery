// No-op shim for the `eventsource` package. Sanity's @sanity/eventsource
// requires this module on Node, but React Native does not bundle Node
// built-ins like `url`. We never start a live listener in the app, so
// returning an empty object satisfies the resolver.
module.exports = {};