import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

interface AnimatedIconProps {
  style: any[];
  name: string;
  size: Animated.Adaptable<number>;
  color?: Animated.Adaptable<number>;
}

const AnimatedIconX = Animated.createAnimatedComponent(MaterialCommunityIcons);

const AnimatedIcon = (props: AnimatedIconProps) => {
  return <AnimatedIconX {...props} />;
};

export default AnimatedIcon;
