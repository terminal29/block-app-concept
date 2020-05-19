import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { CarouselRenderProps } from "react-native-sideswipe";
import Animated, { interpolate, cond, eq, sub, block, useCode, set, debug, SpringUtils } from "react-native-reanimated";
import { State, TapGestureHandler, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Redash, { useGestureHandler, withSpringTransition, spring } from "react-native-redash";

export interface SwipeCarouselScreenProps {
  title: string;
  accentColour: string;
  backgroundColour: string;
  iconName: string;
  onPressed?: () => void;
}

export interface SwipeCarouselScreenPropsInt {
  containerSize: { width: number; height: number };
  item: SwipeCarouselScreenProps;
  index: number;
}

const SwipeCarouselScreen = (props: SwipeCarouselScreenPropsInt) => {
  const pressState = new Animated.Value<number>(0);
  const pressStateSlow = withSpringTransition(pressState, SpringUtils.makeConfigFromBouncinessAndSpeed({ ...SpringUtils.makeDefaultConfig(), bounciness: 10, speed: 50 }));
  const animatedMargin = interpolate(pressStateSlow, { inputRange: [0, 1], outputRange: [50, 60] });

  return (
    <View style={[{ width: props.containerSize.width, height: props.containerSize.height }, styles.container]}>
      <Animated.View style={[{ width: sub(styles.box.width, animatedMargin), height: sub(styles.box.height, animatedMargin) }]}>
        <TouchableWithoutFeedback
          onPressIn={() => pressState.setValue(1)}
          onPressOut={() => pressState.setValue(0)}
          onPress={() => props.item.onPressed?.()}
          style={StyleSheet.absoluteFill}
          containerStyle={StyleSheet.absoluteFill}
        >
          <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: props.item.accentColour }]}></Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </View>
  );
};

export default SwipeCarouselScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 300,
    height: 300,
  },
});
