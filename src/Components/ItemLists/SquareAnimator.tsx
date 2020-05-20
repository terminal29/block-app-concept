import * as React from "react";
import { Text, View, StyleSheet, BackHandler } from "react-native";
import { connect } from "react-redux";
import ReduxState from "../../State/ReduxState";
import { SwipeCarouselScreenProps } from "../Carousel/SwipeCarouselScreen";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Animated, { useCode, cond, and, eq, diff, set, call, neq } from "react-native-reanimated";
import { withSpringTransition } from "react-native-redash";
import DummySquare from "../Carousel/DummySquare";

interface SquareAnimatorProps {
  navigationRouteName: string;
  screenElement: any;
}

const MapStateToProps = (state: ReduxState) => {
  return { screenProps: state.carouselScreenProps };
};

const MapDispatchToProps = (dispatch: any) => {
  return {};
};

interface SquareAnimatorReduxProps {
  screenProps: Array<SwipeCarouselScreenProps>;
}

interface SquareAnimatorCombinedProps extends SquareAnimatorReduxProps, SquareAnimatorProps {}

function SquareAnimator(props: SquareAnimatorProps) {
  const typedProps = props as SquareAnimatorReduxProps & SquareAnimatorProps;
  const screenProps = typedProps.screenProps.find((screenProp) => screenProp.navigationPath === typedProps.navigationRouteName);
  if (!screenProps)
    throw new Error(
      `Cannot find screen with name ${props.navigationRouteName}. Possible routes are: [${typedProps.screenProps.map((screenProps) => screenProps.navigationPath).join(", ")}]`
    );

  const navigation = useNavigation();
  const oldAnimationState = useRef(new Animated.Value<number>(0));
  const openAnimationState = useRef(new Animated.Value<number>(0));
  const openAnimationStateSlow = useRef(withSpringTransition(openAnimationState.current));
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [animating, setAnimating] = useState(true);
  const [open, setOpen] = useState(false);

  // prettier-ignore
  useCode(() =>cond(
      and(eq(diff(openAnimationStateSlow.current), 0), eq(openAnimationState.current, openAnimationStateSlow.current), neq(openAnimationState.current, oldAnimationState.current)), 
        [call([openAnimationState.current], animationFinished), set(oldAnimationState.current, openAnimationState.current)]
        ), 
      []
      );

  useEffect(
    () =>
      navigation.addListener("focus", () => {
        openAnimationState.current.setValue(1);
      }),
    [navigation]
  );

  useLayoutEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", onBackPressed);
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPressed);
  }, [navigation]);

  const onBackPressed = () => {
    setAnimating(true);
    openAnimationState.current.setValue(0);
    return true;
  };

  const animationFinished = (args: readonly number[]) => {
    setAnimating(false);
    if (args[0] === 1) {
      setOpen(true);
    } else if (args[0] === 0) {
      setOpen(false);
      navigation.goBack();
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} onLayout={(e) => setContainerSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}>
      {containerSize.width !== 0 && containerSize.height !== 0 && (
        <DummySquare
          animationProgress={openAnimationStateSlow.current}
          iconName={screenProps.iconName}
          title={screenProps.title}
          titleColour={screenProps.titleColour}
          accentColour={screenProps.accentColour}
          secondaryColour={screenProps.backgroundColour}
          containerSize={containerSize}
        />
      )}
      {!animating && open && typedProps.screenElement}
    </View>
  );
}
export default connect(MapStateToProps, MapDispatchToProps)(SquareAnimator);

const styles = StyleSheet.create({
  container: {},
});
