import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStore } from "redux";
import { Provider } from "react-redux";
import ReduxState from "./src/State/ReduxState";
import Reducer from "./src/State/Reducer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { useCode, debug } from "react-native-reanimated";
import SwipeCarousel from "./src/Components/Carousel/SwipeCarousel";
import SwipeCarouselScreen from "./src/Components/Carousel/SwipeCarouselScreen";

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
  const [inMenu, setInMenu] = useState(true);
  const [screenName, setScreenName] = useState<string | null>(null);

  useEffect(() => {
    // Preload fonts to fix a bug where animated icons wouldn't take animated styles that were set before the font was loaded
    MaterialCommunityIcons.loadFont().then((_: any) => {
      setFontsLoaded(true);
    });
  }, []);

  const screenProps = [
    {
      title: "Blocks",
      accentColour: "#05668D",
      backgroundColour: "#243F51",
      iconName: "cube-outline",
      onPressed: () => {
        console.log("blocks");
        setInMenu(false);
        setScreenName("blocks");
      },
    },
    {
      title: "Building Guides",
      accentColour: "#028090",
      iconName: "map-outline",
      backgroundColour: "#24484F",
      onPressed: () => {
        console.log("building_guides");
        setInMenu(false);
        setScreenName("building_guides");
      },
    },
    {
      title: "Weapons & Items",
      accentColour: "#00A896",
      iconName: "sword",
      backgroundColour: "#2A5A50",
      onPressed: () => {
        console.log("weapons_and_items");
        setInMenu(false);
        setScreenName("weapons_and_items");
      },
    },
    {
      title: "Structures",
      accentColour: "#02C39A",
      backgroundColour: "#306853",
      iconName: "castle",
      onPressed: () => {
        console.log("structures");
        setInMenu(false);
        setScreenName("structures");
      },
    },
  ];

  return (
    <Provider store={store}>
      <SwipeCarousel buttons={screenProps} />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
