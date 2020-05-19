import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Block } from "../../Structs/Block";
import ActionType from "../../State/ActionType";
import Actions from "../../State/Actions";

const MapStateToProps = (state: any) => {
  return { blocks: state.blocks };
};

const MapDispatchToProps = (dispatch: any) => {
  return {
    RemoveBlock: (block: Block) => dispatch(Actions.RemoveBlockAction(block)),
  };
};

function BlocksList(props: any) {
  return (
    <View style={styles.container}>
      {props.blocks.map((block: Block) => (
        <TouchableOpacity key={block.id} onPress={() => props.RemoveBlock(block)}>
          <Text>{block.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default connect(MapStateToProps, MapDispatchToProps)(BlocksList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
