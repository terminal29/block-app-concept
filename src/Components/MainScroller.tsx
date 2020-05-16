import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useRef, useState, useMemo } from "react";
import Animated, { interpolate, useCode, cond, and, eq, call, Extrapolate } from "react-native-reanimated";
import { timing } from "react-native-redash";
import Carousel2Screen from "./Carousel2Screen";
import Carousel2 from "./Carousel2";

interface IconButtonProps {
  title: string;
  accentColour: string;
  backgroundColour: string;
  iconName: string;
  onPressed?: (animFinished: boolean) => void;
}

interface MainScrollerProps {
  buttons: IconButtonProps[];
  carouselBackgroundColourNode?: Animated.Value<number>;
}

const MainScroller = (props: MainScrollerProps) => {
  const [screenOpened, setScreenOpened] = useState(false);
  const screenIndex = useRef(0);
  const to = useRef(new Animated.Value<number>(0));
  const from = useRef(new Animated.Value<number>(0));
  to.current.setValue(screenOpened ? 0 : 1);
  from.current.setValue(screenOpened ? 1 : 0);
  const screenOpenTransitionProgress = useMemo(() => timing({ from: from.current, to: to.current }), [screenOpened]);
  const scale = interpolate(screenOpenTransitionProgress, { inputRange: [0, 1, 2], outputRange: [0.01, 1, 2], extrapolate: Extrapolate.CLAMP });
  const opacity = interpolate(screenOpenTransitionProgress, { inputRange: [0, 0.05, 1], outputRange: [0, 0, 1], extrapolate: Extrapolate.CLAMP });

  useCode(
    () => [
      cond(and(eq(to.current, 0), eq(screenOpenTransitionProgress, 0)), [call([], () => props.buttons[screenIndex.current].onPressed?.(true))]),
      /*cond(and(eq(to.current, 1), eq(screenOpenTransitionProgress, 1)), [call([], () => console.log("Gone to 1"))]),*/ // Saved for later
    ],
    [props.buttons]
  );

  const screenRenderFunctions = useMemo(
    () =>
      props.buttons.map((screenProp, index) => (animatedScrollIndex: Animated.Node<number>, animatedBackgroundColor: Animated.Node<number>) => (
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale }], opacity }]} pointerEvents={screenOpened ? "none" : "auto"}>
          <Carousel2Screen
            key={screenProp.title}
            screenTitle={screenProp.title}
            animatedScrollIndex={animatedScrollIndex}
            iconName={screenProp.iconName}
            accentColour={screenProp.accentColour}
            animatedColour={animatedBackgroundColor}
            onPressed={() => {
              setScreenOpened(!screenOpened);
              screenIndex.current = index;
              screenProp.onPressed?.(false);
            }}
          />
        </Animated.View>
      )),
    [props.buttons]
  );

  return (
    <Animated.View style={StyleSheet.absoluteFill}>
      <Carousel2
        scrollEnabled={!screenOpened}
        screenRenderFunctions={screenRenderFunctions}
        backgroundColours={props.buttons.map((screenProp) => screenProp.backgroundColour)}
        animatedBackgroundColourNode={props.carouselBackgroundColourNode}
      />
    </Animated.View>
  );
};

export default MainScroller;

const styles = StyleSheet.create({
  container: {},
});
