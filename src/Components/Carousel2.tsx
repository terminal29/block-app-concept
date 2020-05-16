import * as React from "react";
import { Text, View, StyleSheet, LayoutChangeEvent } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  useCode,
  debug,
  diffClamp,
  diff,
  cond,
  eq,
  set,
  add,
  not,
  clockRunning,
  floor,
  divide,
  stopClock,
  lessThan,
  lessOrEq,
  greaterOrEq,
  multiply,
  SpringUtils,
  min,
  max,
  sub,
  abs,
  neq,
  greaterThan,
  call,
} from "react-native-reanimated";
import { useCallback, useRef } from "react";
import {
  usePanGestureHandler,
  withOffset,
  snapPoint,
  useValue,
  timing,
  useClock,
  spring,
  clamp,
  useSpringTransition,
  withSpring,
  withSpringTransition,
  withTimingTransition,
  interpolateColor,
} from "react-native-redash";

interface Carousel2Props {
  screenRenderFunctions: ((scrollIndexAnimated: Animated.Node<number>, animatedBackgroundColour: Animated.Node<number>) => any)[];
  scrollEnabled?: boolean;
  backgroundColours: string[];
  onIndexChanged?: (index: number) => void;
  animatedBackgroundColourNode?: Animated.Value<number>;
}

const Carousel2 = (props: Carousel2Props) => {
  if (props.screenRenderFunctions.length !== props.backgroundColours.length) {
    throw "Number of screens does not match number of background colours supplied";
  }
  const [containerSize, setContainerSize] = React.useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const onLayout = useCallback((e: LayoutChangeEvent) => setContainerSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height }), []);

  const { gestureHandler, translation, state, velocity } = usePanGestureHandler();
  const clock = useClock();
  const index = useValue(0);
  const offsetX = useRef(new Animated.Value(0));
  const translateX = useRef(new Animated.Value(0));
  const slowTranslateX = withSpringTransition(translateX.current, { stiffness: cond(eq(state, State.ACTIVE), 1000, 100), damping: cond(eq(state, State.ACTIVE), 1000, 100) });
  const snapPoints = props.screenRenderFunctions.map((_, i) => i * -containerSize.width);
  const maxTranslateX = multiply(containerSize.width, -Math.max(snapPoints.length - 1, 0));
  const scrollIndexAnimated = multiply(divide(translateX.current, maxTranslateX), max(0, props.screenRenderFunctions.length - 1));
  const scrollIndexAnimatedSlow = multiply(divide(slowTranslateX, maxTranslateX), props.screenRenderFunctions.length);

  const to = snapPoint(translateX.current, velocity.x, snapPoints);
  const toNoVel = snapPoint(translateX.current, 0, snapPoints);

  const scale = sub(1, divide(divide(abs(sub(slowTranslateX, toNoVel)), max(containerSize.width, 1)), 50));

  const backgroundColourAnimated = interpolateColor(scrollIndexAnimatedSlow, {
    inputRange: props.backgroundColours.map((_, index) => index),
    outputRange: props.backgroundColours,
  });

  if (props.animatedBackgroundColourNode) useCode(() => set(props.animatedBackgroundColourNode as Animated.Value<number>, backgroundColourAnimated), [backgroundColourAnimated]);

  const setIndexIfNotSame = (val, check) => cond(neq(val, check), [set(val, check), call([val], (args) => props.onIndexChanged?.(args[0]))]);

  // Run scroll animations
  // prettier-ignore
  useCode(
    () => [
      cond(
        eq(state, State.ACTIVE), 
        [
          set(translateX.current, add(offsetX.current, translation.x)), 
          cond(
            clockRunning(clock),
            stopClock(clock)
          )
        ]
      ),
      cond(
        eq(state, State.END), 
        [
          set(translateX.current, spring({ clock, from: translateX.current, to, config:{ stiffness: 1000, damping: cond(eq(state, State.ACTIVE), 1000, 100) }})), 
          set(offsetX.current, translateX.current),
          cond(not(clockRunning(clock)),
          [
            setIndexIfNotSame(index, floor(divide(translateX.current, -containerSize.width))),
          ])
        ]
      ),
      cond(
        greaterThan(translateX.current, 0),
        [
          stopClock(clock),
          setIndexIfNotSame(index, 0),
          set(translateX.current, 0),
        ]
      ),
      cond(
        lessThan(translateX.current, maxTranslateX), 
        [
          stopClock(clock),
          setIndexIfNotSame(index, props.screenRenderFunctions.length - 1),
          set(translateX.current, maxTranslateX),
        ]
      )
    ],
    [snapPoints]
  );

  return (
    <PanGestureHandler {...gestureHandler} enabled={props.scrollEnabled ?? true}>
      <Animated.View style={[StyleSheet.absoluteFill]} onLayout={onLayout}>
        <Animated.View style={[styles.horizontalScrollPanel, { transform: [{ translateX: translateX.current }] }]}>
          {containerSize &&
            props.screenRenderFunctions.map((screenRenderFunction: any) => (
              <Animated.View key={Math.random()} style={{ width: containerSize?.width, height: containerSize?.height }}>
                {screenRenderFunction(scrollIndexAnimated, backgroundColourAnimated)}
              </Animated.View>
            ))}
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Carousel2;

const styles = StyleSheet.create({
  container: {},
  backgroundContainer: {
    backgroundColor: "red",
  },
  horizontalScrollPanel: {
    flexDirection: "row",
  },
  screenContainer: {
    backgroundColor: "blue",
  },
});
