import * as React from "react";
import { Text, View, StyleSheet, Image, TouchableHighlight } from "react-native";
import { Block } from "../../Structs/Block";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { TouchableNativeFeedback, TouchableOpacity } from "react-native-gesture-handler";

interface BlockListItemProps {
  block: Block;
  height: number;
  onPress?: () => void;
}

const BlockListItem = (props: BlockListItemProps) => {
  return (
    <TouchableOpacity style={[styles.touch, { height: props.height }]} onPress={props.onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {props.block.iconImage ? (
            <Image source={{ uri: props.block.iconImage }} width={props.height * 0.8} height={props.height * 0.8} resizeMode={"contain"} />
          ) : (
            <MaterialCommunityIcons name={"file-question"} size={30} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text>{props.block.name}</Text>
        </View>
        <View style={styles.chevronContainer}>
          <Ionicons name={"ios-arrow-forward"} color={"rgba(0,0,0,0.2)"} size={30} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BlockListItem;

const styles = StyleSheet.create({
  touch: {},
  container: {
    flex: 1,
    flexDirection: "row",
  },
  iconContainer: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    flex: 0,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  chevronContainer: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    flex: 0,
  },
});
