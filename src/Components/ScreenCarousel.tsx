import * as React from "react";
import { Text, View, StyleSheet, LayoutChangeEvent } from "react-native";
import { connect } from "react-redux";
import { useState, useRef, useMemo, useEffect } from "react";
import Animated, { Value, concat, divide, block, set, abs, max, sub, greaterThan, cond, and, eq, call } from "react-native-reanimated";
import { ReText, onScrollEvent, interpolateColor } from "react-native-redash";
import { CarouselScreenProps, CarouselScreen2 } from "./ScreenCarouselComponents/CarouselScreen";
import IndicatorDot from "./ScreenCarouselComponents/IndicatorDot";
import { TouchableHighlight } from "react-native-gesture-handler";
import { nodeArrayMax } from "../Utilities/ReanimatedUtilities";

export interface CarouselScreen {
  screenProps: CarouselScreenProps;
}

export interface ScreenCarouselProps {
  screens: CarouselScreen[];
  containerStyle?: any;
  debugView?: boolean;
  scrollIndexNode?: Animated.Value<number>;
  backgroundColourNode?: Animated.Value<number>;
  onScreenActivationAnimationFinished?: (screenIndex: number) => void;
  initialScreen?: { index: number; wasOpen: boolean };
}

const MapStateToProps = (state: any) => {
  return {};
};

const MapDispatchToProps = (dispatch: any) => {
  return {};
};

const ScreenCarousel = (props: ScreenCarouselProps) => {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const transitionProgressions = useRef(props.screens.map((_) => new Animated.Value(0)));
  const screenRefs = useMemo(() => props.screens.map((_) => React.createRef<CarouselScreen2>()), props.screens);
  const [interactionEnabled, setInteractionEnabled] = useState(!props.initialScreen?.wasOpen); // Todo base this off of props initial transition state
  const anyTransitionProgress = nodeArrayMax(transitionProgressions.current);

  const OnCarouselLayout = (event: LayoutChangeEvent) => {
    if (screenSize.width == 0 && screenSize.height == 0) {
      setScreenSize({
        width: event.nativeEvent.layout.width,
        height: event.nativeEvent.layout.height,
      });
    }
  };

  const bgColours = useMemo(() => props.screens.map((screen) => screen.screenProps.backgroundColor), props.screens);
  const rawScrollX = useRef(new Value<number>(0));
  const scrollIndex = divide(rawScrollX.current, screenSize.width);
  const interpolatedColourRaw = interpolateColor(scrollIndex, {
    inputRange: bgColours.map((_, index) => index),
    outputRange: bgColours,
  });

  const indicatorProgress = (indicatorIndex: number) => {
    const progressLinear = max(sub(1, abs(sub(indicatorIndex, scrollIndex))), 0);
    return progressLinear;
  };

  let interpolatedColour = interpolatedColourRaw;

  if (props.scrollIndexNode) {
    interpolatedColour = block([set(props.scrollIndexNode, scrollIndex), interpolatedColour]);
  }

  if (props.backgroundColourNode) {
    interpolatedColour = block([set(props.backgroundColourNode, interpolatedColourRaw), interpolatedColour]);
  }

  const shouldShowItems = !(screenSize.width == 0 || screenSize.height == 0);

  useEffect(() => {
    if (props.initialScreen) {
      scrollViewRef.current?.getNode().scrollTo({ x: props.initialScreen.index * screenSize.width, y: 0, animated: false });
    }
  }, [props.initialScreen, shouldShowItems]);

  const indicatorDots = useMemo(
    () =>
      props.screens.map((screen, dotIndex) => (
        <IndicatorDot
          key={screen.screenProps.title}
          progress={indicatorProgress(dotIndex)}
          iconName={screen.screenProps.iconName}
          iconColor={interpolatedColour}
          onPressHandler={() =>
            scrollViewRef.current?.getNode()?.scrollTo({
              x: dotIndex * screenSize.width,
              y: 0,
              animated: true,
            })
          }
          screenAnimationProgress={anyTransitionProgress}
          option={true}
        />
      )),
    [props.screens, scrollViewRef, anyTransitionProgress, interpolateColor, screenSize]
  );

  const carouselScreens = useMemo(
    () =>
      props.screens.map((screen, screenIndex) => (
        <View
          style={{
            width: screenSize.width,
            height: screenSize.height,
          }}
          key={screen.screenProps.title}
          pointerEvents={interactionEnabled ? "auto" : "none"}
        >
          {
            <CarouselScreen2
              {...screen.screenProps}
              ref={screenRefs[screenIndex]}
              onScreenActivated={() => {
                console.log("Activated");
                setInteractionEnabled(false);
                scrollViewRef.current?.getNode().scrollTo({ x: screenIndex * screenSize.width, y: 0, animated: false });
                screenRefs[screenIndex].current?.triggerOpenAnimation();
              }}
              onScreenActivationAnimationFinished={(wasOpening: boolean) => {
                if (wasOpening) {
                  console.log("Screen just opened");
                  props.onScreenActivationAnimationFinished?.(screenIndex);
                } else {
                  console.log("Screen just closed");
                  setInteractionEnabled(true);
                }
              }}
              transitionAnimationProgress={transitionProgressions.current[screenIndex]}
              cardSize={Math.min(screenSize.height, screenSize.width)}
              parentSize={screenSize}
              iconColor={interpolatedColour}
              initialState={props.initialScreen && props.initialScreen.index === screenIndex && props.initialScreen.wasOpen ? { startAt: true, goTo: false } : undefined}
            />
          }
        </View>
      )),
    [screenSize, props.screens, screenRefs, interpolateColor, interactionEnabled, props.onScreenActivationAnimationFinished, transitionProgressions, props.initialScreen]
  );

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedColour }]} onLayout={OnCarouselLayout} pointerEvents={interactionEnabled ? "auto" : "none"}>
      <Animated.ScrollView
        style={styles.scrollView}
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onScroll={onScrollEvent({ x: rawScrollX.current })}
        ref={scrollViewRef}
        scrollEnabled={interactionEnabled}
      >
        {shouldShowItems && carouselScreens}
      </Animated.ScrollView>
      <View style={styles.indicatorDotContainer}>{shouldShowItems && indicatorDots}</View>
    </Animated.View>
  );
};

export default connect(MapStateToProps, MapDispatchToProps)(ScreenCarousel);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  screenContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  debugView: {
    backgroundColor: "rgba(0.0,0.0,0.0,0.4)",
    color: "white",
    height: 50,
    position: "absolute",
    zIndex: 1000,
    left: 20,
    bottom: 20,
    paddingHorizontal: 20,
  },
  indicatorDotContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
