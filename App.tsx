import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { createStore } from "redux";
import { Provider } from "react-redux";
import ReduxState from "./src/State/ReduxState";
import Reducer from "./src/State/Reducer";
import ScreenCarousel from "./src/Components/ScreenCarousel";
import Animated, { concat } from "react-native-reanimated";
import { BackHandler } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Font, AppLoading } from "expo";
import PopupScreen from "./src/Components/PopupScreen";
import { ReText } from "react-native-redash";

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

const DebugView = (node: Animated.Node<number>) => (
  <ReText text={concat(node)} style={{ position: "absolute", left: 50, top: 50, backgroundColor: "rgba(0,0,0,0.5)", color: "white" }} />
);

export default function App() {
  const [screenState, setScreenState] = useState({
    openedScreenIndex: 0,
    isScreenOpen: false,
    wasScreenOpen: false,
  });
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const screenProps = [
    {
      title: "Blocks",
      accentColor: "#05668D",
      backgroundColor: "#243F51",
      iconName: "cube-outline",
    },
    {
      title: "Building Guides",
      accentColor: "#00A896",
      iconName: "map-outline",
      backgroundColor: "#24484F",
    },
    {
      title: "Weapons & Items",
      accentColor: "#028090",
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

  const goBackToMain = () => {
    setScreenState((screenState) => ({
      ...screenState,
      wasScreenOpen: true,
      isScreenOpen: false,
    }));
  };

  useEffect(() => {
    const handler = () => {
      if (screenState.isScreenOpen) {
        goBackToMain();
        return true;
      }
      return false;
    };
    BackHandler.addEventListener("hardwareBackPress", handler);
    return () => BackHandler.removeEventListener("hardwareBackPress", handler);
  }, [screenState.isScreenOpen]);

  const carouselAnimatedBackgroundColour = new Animated.Value(0);

  const screens = screenProps.map((screenProp, index) => <PopupScreen {...screenProps[index]} onBackPressed={goBackToMain} />);

  const screenCarousel = !fontsLoaded ? (
    <AppLoading />
  ) : (
    <ScreenCarousel
      onScreenActivationAnimationFinished={(index) => {
        setScreenState(() => ({
          isScreenOpen: true,
          wasScreenOpen: false,
          openedScreenIndex: index,
        }));
      }}
      backgroundColourNode={carouselAnimatedBackgroundColour}
      initialScreen={{ index: screenState.openedScreenIndex, wasOpen: screenState.wasScreenOpen }}
      screens={[
        {
          screenProps: screenProps[0],
        },
        {
          screenProps: screenProps[1],
        },
        {
          screenProps: screenProps[2],
        },
        {
          screenProps: screenProps[3],
        },
      ]}
    />
  );

  return (
    <Provider store={store}>
      <Animated.View style={[styles.container]}>{screenCarousel}</Animated.View>
      {screenState.isScreenOpen && <Animated.View style={StyleSheet.absoluteFill}>{screens[screenState.openedScreenIndex]}</Animated.View>}
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
