import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { CarouselRenderProps } from "react-native-sideswipe";
import Animated, { interpolate, cond, eq, sub, block, useCode, set, debug, SpringUtils } from "react-native-reanimated";
import { State, TapGestureHandler, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Redash, { useGestureHandler, withSpringTransition, spring, colorForBackground } from "react-native-redash";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface SwipeCarouselScreenProps {
  title: string;
  titleColour: string;
  accentColour: string;
  backgroundColour: string;
  iconName: string;
  navigationPath: string;
  onPressed?: () => void;
}

export interface SwipeCarouselScreenPropsInt {
  containerSize: { width: number; height: number };
  item: SwipeCarouselScreenProps;
  index: number;
  animatedIndex: Animated.Node<number>;
  secondaryColour: Animated.Node<number>;
}

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const SwipeCarouselScreen = (props: SwipeCarouselScreenPropsInt) => {
  const pressState = new Animated.Value<number>(0);
  const pressStateSlow = withSpringTransition(pressState, SpringUtils.makeConfigFromBouncinessAndSpeed({ ...SpringUtils.makeDefaultConfig(), bounciness: 10, speed: 50 }));
  const animatedIconScale = interpolate(pressStateSlow, { inputRange: [0, 1], outputRange: [1, 0.95] });
  return (
    <View style={[{ width: props.containerSize.width, height: props.containerSize.height }, styles.container]}>
      <Animated.View style={[styles.box, { transform: [{ scale: animatedIconScale }] }]}>
        <Animated.View style={[styles.header, { backgroundColor: props.item.accentColour }]}>
          <Text style={[styles.headerText, { color: props.item.titleColour }]}>{props.item.title}</Text>
        </Animated.View>
        <TouchableWithoutFeedback
          onPressIn={() => pressState.setValue(1)}
          onPressOut={() => pressState.setValue(0)}
          onPress={() => props.item.onPressed?.()}
          style={StyleSheet.absoluteFill}
          containerStyle={StyleSheet.absoluteFill}
        >
          <Animated.View style={[StyleSheet.absoluteFill, styles.container]}>
            <AnimatedIcon name={props.item.iconName} size={180} color={props.secondaryColour} />
          </Animated.View>
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
    width: 250,
    height: 250,
    borderRadius: 30,
    backgroundColor: "white",
  },
  header: {
    position: "absolute",
    top: -17,
    left: 30,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  headerText: {
    fontSize: 15,
  },
});
