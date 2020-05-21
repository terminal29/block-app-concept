import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Stop, ForeignObject, Circle, Rect, RadialGradient, Mask, ClipPath } from "react-native-svg";
import Animated, { multiply, sub, concat } from "react-native-reanimated";

interface GradientBorderProps {
  style: any;
  borderStyle: any;
  children: any;
  stops: Array<{ colour: string; percentage: number }>;
  borderRadius: number;
  borderThickness: Animated.Adaptable<number>;
  angle: Animated.Adaptable<number>;
}

const AnimatedSVG = Animated.createAnimatedComponent(Svg);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedMask = Animated.createAnimatedComponent(Mask);

const GradientBorder = (props: GradientBorderProps) => {
  const offsets = { s: "10%", e: "90%" };
  const size = 400;
  return (
    <View style={props.style}>
      <AnimatedSVG style={StyleSheet.compose(StyleSheet.absoluteFill, props.borderStyle)} width={"100%"} height={"100%"} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="gradient-tr" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset={offsets.s} stopColor="#ff0600" />
            <Stop offset={offsets.e} stopColor="#81ff00" />
          </LinearGradient>
          <LinearGradient id="gradient-br" x1="100%" y1="0%" x2="0%" y2="100%">
            <Stop offset={offsets.s} stopColor="#81ff00" />
            <Stop offset={offsets.e} stopColor="#00fffd" />
          </LinearGradient>
          <LinearGradient id="gradient-bl" x1="100%" y1="100%" x2="0%" y2="0%">
            <Stop offset={offsets.s} stopColor="#00fffd" />
            <Stop offset={offsets.e} stopColor="#7c00ff" />
          </LinearGradient>
          <LinearGradient id="gradient-tl" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset={offsets.s} stopColor="#7c00ff" />
            <Stop offset={offsets.e} stopColor="#ff0600" />
          </LinearGradient>
          <ClipPath id="border">
            <AnimatedRect
              x={props.borderThickness}
              y={props.borderThickness}
              width={sub(size, multiply(2, props.borderThickness))}
              height={sub(size, multiply(2, props.borderThickness))}
              rx={`${props.borderRadius}`}
              fill="white"
            />
          </ClipPath>
        </Defs>
        <AnimatedRect width={`${size / 2}`} height={`${size / 2}`} x={`${size / 2}`} fill="url(#gradient-tr)" />
        <AnimatedRect width={`${size / 2}`} height={`${size / 2}`} x={`${size / 2}`} y={`${size / 2}`} fill="url(#gradient-br)" />
        <AnimatedRect width={`${size / 2}`} height={`${size / 2}`} y={`${size / 2}`} fill="url(#gradient-bl)" />
        <AnimatedRect width={`${size / 2}`} height={`${size / 2}`} fill="url(#gradient-tl)" />
        <AnimatedRect transform={concat("rotate(", props.angle, ` ${size / 2} ${size / 2})`)} width={`${size}`} height={`${size}`} fill="white" clipPath="url(#border)" />
      </AnimatedSVG>
      {props.children}
    </View>
  );
};

export default GradientBorder;

const styles = StyleSheet.create({
  container: {},
});
