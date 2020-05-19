import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect, useRef, useMemo, useCallback, createRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStore } from "redux";
import { Provider } from "react-redux";
import ReduxState from "./src/State/ReduxState";
import Reducer from "./src/State/Reducer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SwipeCarousel from "./src/Components/Carousel/SwipeCarousel";
import { createStackNavigator } from "@react-navigation/stack";
import BlocksList from "./src/Components/ItemLists/BlocksList";

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

const Stack = createStackNavigator();

const screenProps = [
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
];

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigatorRef = useRef(null);

  useEffect(() => {
    // Preload fonts to fix a bug where animated icons wouldn't take animated styles that were set before the font was loaded
    MaterialCommunityIcons.loadFont().then((_: any) => {
      setFontsLoaded(true);
    });
  }, []);

  const SwipeCarouselImpl = useCallback(
    () => <SwipeCarousel buttons={screenProps.map((screenProp) => ({ ...screenProp, onPressed: () => navigatorRef.current?.navigate(screenProp.navigationPath) }))} />,
    []
  );

  const BlocksScreenImpl = () => <BlocksList></BlocksList>;

  const StackNavigationImpl = (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: "transparent",
          opacity: 1,
        },
      }}
    >
      <Stack.Screen name="Menu" component={SwipeCarouselImpl} />
      <Stack.Screen name="blocks" component={BlocksScreenImpl} />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer ref={navigatorRef}>
      <Provider store={store}>{StackNavigationImpl}</Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
