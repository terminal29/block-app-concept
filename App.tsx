import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect, useRef, useMemo, useCallback, createRef } from "react";
import { StyleSheet, Text, View, Easing, StatusBar } from "react-native";
import { createStore } from "redux";
import { Provider } from "react-redux";
import ReduxState from "./src/State/ReduxState";
import Reducer from "./src/State/Reducer";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import SwipeCarousel from "./src/Components/Carousel/SwipeCarousel";
import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from "@react-navigation/stack";
import BlocksList from "./src/Components/ItemLists/BlocksList";
import { TransitionSpec } from "@react-navigation/stack/lib/typescript/src/types";
import SquareAnimator from "./src/Components/ItemLists/SquareAnimator";

const initialState: ReduxState = {
  blocks: [
    {
      id: 0,
      name: "dirt",
      iconImage: "https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/6/62/Dirt_JE2_BE1.png/150px-Dirt_JE2_BE1.png",
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
  carouselScreenProps: [
    {
      title: "Blocks",
      titleColour: "white",
      accentColour: "#05668D",
      backgroundColour: "#243F51",
      iconName: "cube-outline",
      navigationPath: "blocks",
    },
    {
      title: "Building Guides",
      titleColour: "white",
      accentColour: "#028090",
      iconName: "map-outline",
      backgroundColour: "#24484F",
      navigationPath: "building_guides",
    },
    {
      title: "Weapons & Items",
      titleColour: "white",
      accentColour: "#00A896",
      iconName: "sword",
      backgroundColour: "#2A5A50",
      navigationPath: "weapons_and_items",
    },
    {
      title: "Structures",
      titleColour: "white",
      accentColour: "#02C39A",
      backgroundColour: "#306853",
      iconName: "castle",
      navigationPath: "structures",
    },
  ],
};

const store = createStore((state: ReduxState = initialState, action) => Reducer(state, action));

const Stack = createStackNavigator();

const instantTransition: TransitionSpec = {
  animation: "timing",
  config: {
    duration: 0,
    easing: Easing.linear,
  },
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigatorRef = useRef(null);

  useEffect(() => {
    // Preload fonts to fix a bug where animated icons wouldn't take animated styles that were set before the font was loaded
    MaterialCommunityIcons.loadFont().then(async (_: any) => {
      await Ionicons.loadFont();
      setFontsLoaded(true);
    });
  }, []);

  const SwipeCarouselImpl = useCallback(() => <SwipeCarousel />, []);

  const BlocksScreenImpl = () => <SquareAnimator navigationRouteName={"blocks"} renderScreenElement={(backFn) => <BlocksList backFn={backFn}></BlocksList>} />;

  const StackNavigationImpl = (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: "transparent",
          opacity: 1,
        },
        transitionSpec: {
          open: instantTransition,
          close: instantTransition,
        },
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="menu" component={SwipeCarouselImpl} />
      <Stack.Screen name="blocks" component={BlocksScreenImpl} />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer ref={navigatorRef}>
      <View style={{ height: StatusBar.currentHeight }} />
      <Provider store={store}>{StackNavigationImpl}</Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
