import * as React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Animated from "react-native-reanimated";

interface PopupScreenProps {
  accentColor: string;
  title: string;
  iconName: string;
  backgroundColor: string;
  onBackPressed: () => void;
}

const PopupScreen = (props: PopupScreenProps) => {
  return (
    <View style={[styles.container]}>
      <Animated.View style={[styles.cardContainer, { backgroundColor: props.backgroundColor }]}>
        <Animated.View style={[styles.innerContainer]}>
          <Button title={"Back"} onPress={props.onBackPressed} />
        </Animated.View>
        <Animated.Text
          style={[
            styles.titleStyle,
            {
              backgroundColor: props.accentColor,
              top: 30,
              left: 50,
            },
          ]}
        >
          {props.title}
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

export default PopupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 50,
    backgroundColor: "red",
  },
  titleStyle: {
    position: "absolute",
    color: "white",
    fontSize: 16,
    padding: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    fontWeight: "bold",
    left: 55,
    top: 4,
    height: 40,
  },
  innerContainer: {
    backgroundColor: "white",
    borderRadius: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  iconStyle: {},
});
