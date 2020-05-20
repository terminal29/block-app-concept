import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, BackHandler } from "react-native";
import { connect } from "react-redux";
import { Block } from "../../Structs/Block";
import ActionType from "../../State/ActionType";
import Actions from "../../State/Actions";
import Animated, { useCode, debug, cond, eq, diff, and, Clock, call, set, neq } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { withSpringTransition, spring } from "react-native-redash";
import DummySquare from "../Carousel/DummySquare";
import ReduxState from "../../State/ReduxState";
import { SwipeCarouselScreenProps } from "../Carousel/SwipeCarouselScreen";

const MapStateToProps = (state: ReduxState) => {
  return { blocks: state.blocks, screenProps: state.carouselScreenProps.find((prop) => prop.navigationPath === "blocks") };
};

const MapDispatchToProps = (dispatch: any) => {
  return {
    RemoveBlock: (block: Block) => dispatch(Actions.RemoveBlockAction(block)),
  };
};

interface BlocksListProps {}

interface BlockListReduxProps {
  blocks: Array<Block>;
  screenProps: SwipeCarouselScreenProps;
}

function BlocksList(props: BlocksListProps) {
  const typedProps = props as BlocksListProps & BlockListReduxProps;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Text>Blok</Text>
    </View>
  );
}

export default connect(MapStateToProps, MapDispatchToProps)(BlocksList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
