const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
const config = {};
const mergedConfig = mergeConfig(defaultConfig, config);

module.exports = wrapWithReanimatedMetroConfig(mergedConfig);