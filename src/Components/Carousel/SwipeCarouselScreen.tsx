import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { CarouselRenderProps } from "react-native-sideswipe";
import Animated, { interpolate, cond, eq, sub, block, useCode, set, debug, SpringUtils, multiply } from "react-native-reanimated";
import { State, TapGestureHandler, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Redash, { useGestureHandler, withSpringTransition, spring, colorForBackground, useLoop } from "react-native-redash";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Circle, Rect } from "react-native-svg";
import RainbowBorder from "../RainbowBorder";
import { useRef } from "react";

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
  const [showBorder, setBorderShown] = React.useState(false);
  const pressState = useRef(new Animated.Value<number>(0));
  const rotator = useRef(multiply(2 * Math.PI, useLoop(1000, false)));
  const pressStateSlow = useRef(
    withSpringTransition(pressState.current, SpringUtils.makeConfigFromBouncinessAndSpeed({ ...SpringUtils.makeDefaultConfig(), bounciness: 10, speed: 50 }))
  );
  const animatedIconScale = useRef(interpolate(pressStateSlow.current, { inputRange: [0, 1], outputRange: [1, 0.95] }));
  return (
    <View style={[{ width: props.containerSize.width, height: props.containerSize.height }, styles.container]}>
      <Animated.View style={[styles.box, { transform: [{ scale: animatedIconScale.current }] }]}>
        <RainbowBorder
          borderStyle={{ opacity: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 30, overflow: "hidden" }]}
          borderRadius={28}
          borderThickness={multiply(pressStateSlow.current, 3)}
          angle={rotator.current}
          showBorder={showBorder}
        >
          <TouchableWithoutFeedback
            onPressIn={() => {
              pressState.current.setValue(1);
              setBorderShown(true);
            }}
            onPressOut={() => {
              pressState.current.setValue(0);
              setBorderShown(false);
            }}
            onPress={() => props.item.onPressed?.()}
            style={StyleSheet.absoluteFill}
            containerStyle={StyleSheet.absoluteFill}
          >
            <Animated.View style={[StyleSheet.absoluteFill, styles.container]}>
              <AnimatedIcon name={props.item.iconName} size={180} color={props.secondaryColour} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </RainbowBorder>
        <Animated.View style={[styles.header, { backgroundColor: props.item.accentColour }]}>
          <Text style={[styles.headerText, { color: props.item.titleColour }]}>{props.item.title}</Text>
        </Animated.View>
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
