import React, { useState, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { createStore } from "redux";
import { Provider } from "react-redux";
import ReduxState from "./src/State/ReduxState";
import Reducer from "./src/State/Reducer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MainScroller from "./src/Components/MainScroller";
import Animated, { useCode, debug } from "react-native-reanimated";
import BlocksList from "./src/Components/BlocksList";

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
      onPressed: (fin: boolean) => {
        if (fin) {
          console.log("blocks");
          setInMenu(false);
          setScreenName("blocks");
        }
      },
    },
    {
      title: "Building Guides",
      accentColour: "#028090",
      iconName: "map-outline",
      backgroundColour: "#24484F",
      onPressed: (fin: boolean) => {
        if (fin) {
          console.log("building_guides");
          setInMenu(false);
          setScreenName("building_guides");
        }
      },
    },
    {
      title: "Weapons & Items",
      accentColour: "#00A896",
      iconName: "sword",
      backgroundColour: "#2A5A50",
      onPressed: (fin: boolean) => {
        if (fin) {
          console.log("weapons_and_items");
          setInMenu(false);
          setScreenName("weapons_and_items");
        }
      },
    },
    {
      title: "Structures",
      accentColour: "#02C39A",
      backgroundColour: "#306853",
      iconName: "castle",
      onPressed: (fin: boolean) => {
        if (fin) {
          console.log("structures");
          setInMenu(false);
          setScreenName("structures");
        }
      },
    },
  ];

  const carouselBackgroundColourNode = useRef(new Animated.Value(0));
  const appBackgroundColour = carouselBackgroundColourNode.current;

  return (
    <Provider store={store}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: appBackgroundColour }]}>
        {inMenu && <MainScroller buttons={screenProps} carouselBackgroundColourNode={carouselBackgroundColourNode.current} />}
      </Animated.View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
