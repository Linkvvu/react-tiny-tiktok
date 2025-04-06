import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  simpleContainer: {
    flex: 1
  },
  indicatorContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});