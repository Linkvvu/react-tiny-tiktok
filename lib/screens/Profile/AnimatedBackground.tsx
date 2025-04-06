import React from "react";
import { ImageSourcePropType, StyleSheet } from "react-native";
import Animated, { interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated"

export interface AnimatedBackgroundProps {
  source: ImageSourcePropType;
  dragY: SharedValue<number>;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  source,
  dragY
}) => {
  const backgroundContainerStyle = useAnimatedStyle(() => ({
    height: interpolate(dragY.value, [0, 1000], [250, 500]),
  }));

  const backgroundImgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(dragY.value, [0, 1000], [1.1, 1.2]) }],
  }));

  return (
    <Animated.View style={[styles.container, backgroundContainerStyle]}>
      <Animated.Image
        style={[styles.image, backgroundImgStyle]}
        source={source}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  }
})

export default AnimatedBackground;