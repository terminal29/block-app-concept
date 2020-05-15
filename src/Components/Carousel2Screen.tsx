import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Animated, { concat, add, multiply, SpringUtils } from "react-native-reanimated";
import { ReText, useValue, useSpringTransition, withSpringTransition } from "react-native-redash";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Carousel2ScreenProps {
  accentColour?: string;
  textColour?: string;
  screenTitle?: string;
  animatedColour?: Animated.Node<number>;
  animatedScrollIndex?: Animated.Node<number>;
  iconName?: string;
  onPressed?: () => void;
}

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const Carousel2Screen = (props: Carousel2ScreenProps) => {
  const accentColour = props.accentColour ?? "grey";
  const textColour = props.textColour ?? "white";
  const screenTitle = props.screenTitle ?? "Screen";
  const animatedColour = props.animatedColour ?? Animated.color(0.5, 0.5, 0.5);
  const animatedScrollIndex = props.animatedScrollIndex ?? useValue(0);
  const iconName = props.iconName ?? "unknown";

  const pressState = useValue<number>(0);
  const pressStateSlow = withSpringTransition(pressState, SpringUtils.makeConfigFromBouncinessAndSpeed({ ...SpringUtils.makeDefaultConfig(), bounciness: 10, speed: 50 }));

  return (
    <Animated.View style={[styles.container, { backgroundColor: animatedColour }]}>
      <Animated.View style={[styles.innerContainer, { transform: [{ scale: add(1, multiply(pressStateSlow, 0.1)) }] }]}>
        <TouchableWithoutFeedback onPressIn={() => pressState.setValue(1)} onPressOut={() => pressState.setValue(0)} onPress={props.onPressed}>
          <Animated.View style={styles.whiteContainer}>
            <AnimatedIcon name={iconName} style={[styles.icon, { color: animatedColour }]} size={180} />
          </Animated.View>
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.textContainer, { backgroundColor: accentColour }]}>
          <Animated.Text style={[styles.text, { color: textColour }]}>{screenTitle}</Animated.Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

export default Carousel2Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  whiteContainer: {
    width: 250,
    height: 250,
    backgroundColor: "white",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    elevation: 2,
  },
  icon: {},
  textContainer: {
    position: "absolute",
    left: 60,
    top: 10,
    padding: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  text: {},
});
