import * as React from "react";
import { Text, View, StyleSheet, Animated as RNAnimated, Easing as RNEasing } from "react-native";
import Svg, { Defs, LinearGradient, Stop, ForeignObject, Circle, Rect, RadialGradient, Mask, ClipPath, G } from "react-native-svg";
import Animated, { multiply, sub, concat, divide, greaterThan, cond } from "react-native-reanimated";
import { useRef, useMemo } from "react";

interface GradientBorderProps {
  style: any;
  borderStyle: any;
  children: any;
  borderRadius: number;
  borderThickness: Animated.Adaptable<number>;
  angle: Animated.Adaptable<number>;
  showBorder: boolean;
}

const AnimatedSVG = Animated.createAnimatedComponent(Svg);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const RNAnimatedG = Animated.createAnimatedComponent(G);

const offsets = { s: "10%", e: "90%" };
const size = 400;

const GradientBorder = (props: GradientBorderProps) => {
  const SVGBorderImpl = useMemo(
    () => (
      <View style={StyleSheet.absoluteFill}>
        <AnimatedSVG style={StyleSheet.compose(StyleSheet.absoluteFill, props.borderStyle)} width={"100%"} height={"100%"} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <LinearGradient id="gradient-tr" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset={offsets.s} stopColor="rgb(255,0,0)" />
              <Stop offset={offsets.e} stopColor="rgb(125,255,0)" />
            </LinearGradient>
            <LinearGradient id="gradient-br" x1="100%" y1="0%" x2="0%" y2="100%">
              <Stop offset={offsets.s} stopColor="rgb(125,255,0)" />
              <Stop offset={offsets.e} stopColor="rgb(0,255,255)" />
            </LinearGradient>
            <LinearGradient id="gradient-bl" x1="100%" y1="100%" x2="0%" y2="0%">
              <Stop offset={offsets.s} stopColor="rgb(0,255,255)" />
              <Stop offset={offsets.e} stopColor="rgb(125,0,255)" />
            </LinearGradient>
            <LinearGradient id="gradient-tl" x1="0%" y1="100%" x2="100%" y2="0%">
              <Stop offset={offsets.s} stopColor="rgb(125,0,255)" />
              <Stop offset={offsets.e} stopColor="rgb(255,0,0)" />
            </LinearGradient>
          </Defs>
          <RNAnimatedG
            style={{
              transform: [
                {
                  translateX: 400 / 2,
                  translateY: 400 / 2,
                },
                {
                  rotate: cond(greaterThan(props.borderThickness, 0), props.angle, 0),
                },
                {
                  translateX: -400 / 2,
                  translateY: -400 / 2,
                },
                {
                  translateX: -400 / 2 + 100,
                  translateY: -400 / 2 + 100,
                },
                {
                  scale: 1.5,
                },
              ],
            }}
          >
            <AnimatedRect width={`${size / 2}`} height={`${size / 2}`} x={`${size / 2}`} fill="url(#gradient-tr)" />
            <AnimatedRect width={`${size / 2}`} height={`${size / 2}`} x={`${size / 2}`} y={`${size / 2}`} fill="url(#gradient-br)" />
            <AnimatedRect width={`${size / 2}`} height={`${size / 2}`} y={`${size / 2}`} fill="url(#gradient-bl)" />
            <AnimatedRect width={`${size / 2}`} height={`${size / 2}`} fill="url(#gradient-tl)" />
          </RNAnimatedG>
        </AnimatedSVG>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "white", margin: props.borderThickness, borderRadius: props.borderRadius }]}></Animated.View>
      </View>
    ),
    [props.angle, props.borderRadius, props.borderStyle, props.borderThickness]
  );

  return (
    <View style={props.style}>
      {props.showBorder && SVGBorderImpl}
      {props.children}
    </View>
  );
};

export default GradientBorder;

const styles = StyleSheet.create({
  container: {},
});
