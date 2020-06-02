import * as React from "react";
import { Text, View, StyleSheet, Image, TouchableHighlight } from "react-native";
import { Block } from "../../Structs/Block";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { TouchableNativeFeedback, TouchableOpacity } from "react-native-gesture-handler";

interface BlockListItemProps {
  block: Block;
}

const BlockListItem = (props: BlockListItemProps) => {
  return (
    <TouchableOpacity
      style={styles.touch}
      onPress={() => {
        console.log("Hello");
      }}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>{props.block.iconImage ? <Image source={props.block.iconImage} /> : <MaterialCommunityIcons name={"file-question"} size={30} />}</View>
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
  touch: {
    height: 70,
  },
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
