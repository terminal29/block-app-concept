import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from "react";
import { StyleSheet, Text, View, BackHandler, LayoutChangeEvent } from "react-native";
import { connect } from "react-redux";
import { Block } from "../../Structs/Block";
import ActionType from "../../State/ActionType";
import Actions from "../../State/Actions";
import Animated, {
  useCode,
  debug,
  cond,
  eq,
  diff,
  and,
  Clock,
  call,
  set,
  neq,
  SpringUtils,
  interpolate,
  Extrapolate,
  Easing,
  greaterThan,
  block,
  concat,
  add,
  multiply,
  divide,
  sub,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { withSpringTransition, spring, interpolateColor, withTimingTransition, ReText } from "react-native-redash";
import ReduxState from "../../State/ReduxState";
import { SwipeCarouselScreenProps } from "../Carousel/SwipeCarouselScreen";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";

const MapStateToProps = (state: ReduxState) => {
  return { blocks: state.blocks, screenProps: state.carouselScreenProps.find((prop) => prop.navigationPath === "blocks") };
};

const MapDispatchToProps = (dispatch: any) => {
  return {
    RemoveBlock: (block: Block) => dispatch(Actions.RemoveBlockAction(block)),
  };
};

interface BlocksListProps {
  backFn: () => void;
}

interface BlockListReduxProps {
  blocks: Array<Block>;
  screenProps: SwipeCarouselScreenProps;
}

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const AnimatedIonicon = Animated.createAnimatedComponent(Ionicons);

const smallIconSize = 100;
const largeIconSize = 600;
const maxHeaderHeight = 250;
const minHeaderHeight = 80;
const headerSubHeight = 30;

function BlocksList(props: BlocksListProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [titleWidth, setTitleWidth] = useState(0);
  const navigation = useNavigation();
  const typedProps = props as BlocksListProps & BlockListReduxProps;
  const fadeInState = useRef(new Animated.Value<number>(0)).current;
  const fadeInStateSlow = useRef(withTimingTransition(fadeInState, { easing: Easing.ease, duration: 1000 })).current;

  const animatedBackgroundColour = useRef(interpolateColor(fadeInStateSlow, { inputRange: [0, 0.3], outputRange: ["rgba(0,0,0,0)", typedProps.screenProps.backgroundColour] }))
    .current;
  const animatedHeaderProgress = useRef(interpolate(fadeInStateSlow, { inputRange: [0.3, 0.6], outputRange: [0, 1], extrapolate: Extrapolate.CLAMP })).current;
  const animatedScrollerProgress = useRef(interpolate(fadeInStateSlow, { inputRange: [0.6, 1], outputRange: [0, 1], extrapolate: Extrapolate.CLAMP })).current;

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = interpolate(scrollY, {
    inputRange: [0, maxHeaderHeight - minHeaderHeight],
    outputRange: [maxHeaderHeight, minHeaderHeight],
    extrapolate: Extrapolate.CLAMP,
  });

  const headerCollapseProgress = interpolate(scrollY, {
    inputRange: [0, maxHeaderHeight - minHeaderHeight],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  useEffect(() => {
    if (containerSize.height !== 0) {
      fadeInState.setValue(1);
    }
  }, [containerSize]);

  const OnContainerLayout = useCallback((event: LayoutChangeEvent) => setContainerSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height }), []);

  const OnTitleLayout = useCallback((event: LayoutChangeEvent) => setTitleWidth(event.nativeEvent.layout.width), []);

  const OnBackPressed = useCallback(() => navigation.goBack(), [navigation]);

  const HeaderImpl = (
    <Animated.View style={[styles.floatingHeader, { height: headerHeight, backgroundColor: typedProps.screenProps.backgroundColour }]}>
      <Animated.View style={[styles.screenTitleContainer, { opacity: greaterThan(animatedHeaderProgress, 0) }]}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: animatedHeaderProgress }]}>
          <Animated.View style={{ position: "absolute", left: 15, top: 15, width: 50, height: 50 }}>
            <TouchableOpacity
              style={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]}
              containerStyle={[StyleSheet.absoluteFill, { justifyContent: "center", alignItems: "center" }]}
              onPress={typedProps.backFn}
            >
              <AnimatedIonicon size={35} style={{ color: "white" }} name="ios-arrow-back" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: interpolate(headerCollapseProgress, { inputRange: [0, 1], outputRange: [50, -5] }),
              height: minHeaderHeight,
              alignItems: "flex-end",
            }}
          >
            <Animated.View
              style={{
                width: interpolate(headerCollapseProgress, { inputRange: [0, 1], outputRange: [containerSize.width, 100] }),
                alignItems: "center",
                height: minHeaderHeight,
                transform: [{ scale: interpolate(headerCollapseProgress, { inputRange: [0, 1], outputRange: [1, 0.45] }) }],
              }}
            >
              <AnimatedIcon name={typedProps.screenProps.iconName} size={smallIconSize} style={styles.titleIcon} />
            </Animated.View>
          </Animated.View>
        </Animated.View>

        <Animated.Text
          onLayout={OnTitleLayout}
          style={[
            styles.titleText,
            {
              transform: [{ scale: interpolate(headerCollapseProgress, { inputRange: [0, 1], outputRange: [1, 0.75] }) }],
              color: interpolateColor(animatedHeaderProgress, { inputRange: [0, 1], outputRange: ["rgba(255,255,255,0)", "rgba(255,255,255,1)"] }),
              top: interpolate(headerCollapseProgress, { inputRange: [0, 1], outputRange: [150, 12] }),
              left: interpolate(headerCollapseProgress, {
                inputRange: [0, 1],
                outputRange: [divide(sub(containerSize.width, titleWidth), 2), 65],
                extrapolate: Extrapolate.CLAMP,
              }),
            },
          ]}
        >
          {typedProps.screenProps.title}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );

  const HeaderBase = <Animated.View style={[styles.scrollHeader, { height: headerSubHeight, top: headerHeight }]}></Animated.View>;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: animatedBackgroundColour }]} onLayout={OnContainerLayout}>
      <Animated.ScrollView
        style={[styles.scroller, { paddingTop: maxHeaderHeight }]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }])}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerScrollContainer}>
          <Text style={{ height: 300 }}>Block</Text>
          <Text style={{ height: 300 }}>Block</Text>
          <Text style={{ height: 300 }}>Block</Text>
          <Text style={{ height: 300 }}>Block</Text>
          <Text style={{ height: 300 }}>Block</Text>
          <Text style={{ height: 300 }}>Block</Text>
        </View>
      </Animated.ScrollView>
      {HeaderImpl}
      {HeaderBase}
    </Animated.View>
  );
}

export default connect(MapStateToProps, MapDispatchToProps)(BlocksList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroller: {
    ...StyleSheet.absoluteFillObject,
  },
  screenTitleContainer: {},
  floatingHeader: {
    ...StyleSheet.absoluteFillObject,
  },
  titleText: {
    position: "absolute",
    fontSize: 40,
    color: "white",
  },
  titleIcon: {
    position: "absolute",
    color: "white",
  },
  titleIconBackground: {
    position: "absolute",
    color: "rgba(255,255,255,0.05)",
  },
  scrollHeader: {
    borderTopLeftRadius: headerSubHeight,
    borderTopRightRadius: headerSubHeight,
    backgroundColor: "white",
    height: headerSubHeight,
  },
  innerScrollContainer: {},
});
