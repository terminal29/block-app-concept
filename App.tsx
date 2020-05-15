import React, { useState, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStore } from "redux";
import { Provider } from "react-redux";
import ReduxState from "./src/State/ReduxState";
import Reducer from "./src/State/Reducer";
import ScreenCarousel from "./src/Components/ScreenCarousel";
import Animated, {
  concat,
  useCode,
  lessThan,
  cond,
  set,
  interpolate,
  Extrapolate,
  lessOrEq,
  call,
  startClock,
  clockRunning,
  not,
  debug,
  eq,
  sub,
  and,
  neq,
} from "react-native-reanimated";
import { BackHandler } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Font, AppLoading } from "expo";
import PopupScreen from "./src/Components/PopupScreen";
import { ReText, useSpringTransition, useValue, useClock, spring, timing, withSpringTransition } from "react-native-redash";
import Carousel2 from "./src/Components/Carousel2";
import { CarouselScreen2 } from "./src/Components/ScreenCarouselComponents/CarouselScreen";
import Carousel2Screen from "./src/Components/Carousel2Screen";

const initialState: ReduxState = {
  blocks: [
    {
      id: 0,
      name: "dirt",
    },
    {
      id: 1,
      name: "stone",
    },
    {
      id: 2,
      name: "grass",
    },
    {
      id: 3,
      name: "sand",
    },
    {
      id: 4,
      name: "wood",
    },
    {
      id: 5,
      name: "wood_planks",
    },
    {
      id: 6,
      name: "wood_half_planks",
    },
    {
      id: 7,
      name: "wood_stairs",
    },
    {
      id: 8,
      name: "wood_half_planks",
    },
  ],
};

const store = createStore((state: ReduxState = initialState, action) => Reducer(state, action));

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [screenOpened, setScreenOpened] = useState(false);
  const to = useRef(new Animated.Value<number>(0));
  const from = useRef(new Animated.Value<number>(0));
  to.current.setValue(screenOpened ? 0 : 1);
  from.current.setValue(screenOpened ? 1 : 0);
  const screenOpenTransitionProgress = useMemo(() => timing({ from: from.current, to: to.current }), [screenOpened]);
  const scale = interpolate(screenOpenTransitionProgress, { inputRange: [0, 1, 2], outputRange: [0.01, 1, 2], extrapolate: Extrapolate.CLAMP });
  const opacity = interpolate(screenOpenTransitionProgress, { inputRange: [0, 0.05, 1], outputRange: [0, 0, 1], extrapolate: Extrapolate.CLAMP });

  useCode(
    () => [
      cond(and(eq(to.current, 0), eq(screenOpenTransitionProgress, 0)), [call([], () => console.log("Gone to 0"))]),
      cond(and(eq(to.current, 1), eq(screenOpenTransitionProgress, 1)), [call([], () => console.log("Gone to 1"))]),
    ],
    []
  );

  const screenProps = [
    {
      title: "Blocks",
      accentColor: "#05668D",
      backgroundColor: "#243F51",
      iconName: "cube-outline",
    },
    {
      title: "Building Guides",
      accentColor: "#028090",
      iconName: "map-outline",
      backgroundColor: "#24484F",
    },
    {
      title: "Weapons & Items",
      accentColor: "#00A896",
      iconName: "sword",
      backgroundColor: "#2A5A50",
    },
    {
      title: "Structures",
      accentColor: "#02C39A",
      backgroundColor: "#306853",
      iconName: "castle",
    },
  ];

  useEffect(() => {
    // Preload fonts to fix a bug where animated icons wouldn't take animated styles that were set before the font was loaded
    MaterialCommunityIcons.loadFont().then((_: any) => {
      setFontsLoaded(true);
    });
  }, []);

  const screenRenderFunctions = useMemo(
    () =>
      screenProps.map((screenProp, index) => (animatedScrollIndex: Animated.Node<number>, animatedBackgroundColor: Animated.Node<number>) => (
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale }], opacity }]} pointerEvents={screenOpened ? "none" : "auto"}>
          <Carousel2Screen
            key={screenProp.title}
            screenTitle={screenProp.title}
            animatedScrollIndex={animatedScrollIndex}
            iconName={screenProp.iconName}
            accentColour={screenProp.accentColor}
            animatedColour={animatedBackgroundColor}
            onPressed={() => {
              setScreenOpened(!screenOpened);
              console.log(`Carousel button pressed: ${index}`);
            }}
          />
        </Animated.View>
      )),
    [screenProps]
  );

  return (
    <Provider store={store}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <Carousel2 scrollEnabled={!screenOpened} screenRenderFunctions={screenRenderFunctions} backgroundColours={screenProps.map((screenProp) => screenProp.backgroundColor)} />
      </Animated.View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
