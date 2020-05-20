import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { SwipeCarouselScreenProps, SwipeCarouselScreenPropsInt } from "./SwipeCarouselScreen";
import Animated, { interpolate, sub } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface DummySquareProps {
  iconName: string;
  title: string;
  titleColour: string;
  accentColour: string;
  secondaryColour: string;
  containerSize: { width: number; height: number };
  animationProgress: Animated.Node<number>;
}

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const DummySquare = (props: DummySquareProps) => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        {
          backgroundColor: props.secondaryColour,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.box,
          {
            width: interpolate(props.animationProgress, {
              inputRange: [0, 1],
              outputRange: [styles.box.width, props.containerSize.width],
            }),
            height: interpolate(props.animationProgress, {
              inputRange: [0, 1],
              outputRange: [styles.box.height, props.containerSize.height],
            }),
            borderRadius: interpolate(props.animationProgress, {
              inputRange: [0, 1],
              outputRange: [styles.box.borderRadius, 0],
            }),
          },
        ]}
      >
        <Animated.View style={[styles.header, { backgroundColor: props.accentColour, opacity: sub(1, props.animationProgress) }]}>
          <Text style={[styles.headerText, { color: props.titleColour }]}>{props.title}</Text>
        </Animated.View>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.container,
            {
              opacity: sub(1, props.animationProgress),
              transform: [
                {
                  scale: interpolate(props.animationProgress, {
                    inputRange: [0, 1],
                    outputRange: [1, 3],
                  }),
                },
              ],
            },
          ]}
        >
          <AnimatedIcon name={props.iconName} size={180} color={props.secondaryColour} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default DummySquare;

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
