import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useState, useCallback, useRef } from "react";
import SwipeCarouselScreen, { SwipeCarouselScreenProps } from "./SwipeCarouselScreen";
import Carousel from "react-native-snap-carousel";
import Animated from "react-native-reanimated";
import { interpolateColor, withSpringTransition } from "react-native-redash";
import { connect } from "react-redux";
import ReduxState from "../../State/ReduxState";
import { useNavigation } from "@react-navigation/native";

interface SwipeCarouselProps {
  carouselScreenProps: Array<SwipeCarouselScreenProps>;
}

const MapStateToProps = (state: ReduxState) => {
  return { carouselScreenProps: state.carouselScreenProps };
};

const MapDispatchToProps = (dispatch: any) => {
  return {};
};

const SwipeCarousel = (props: SwipeCarouselProps) => {
  const navigator = useNavigation();
  const [carouselContainerSize, setCarouselContainerSize] = useState({ width: 0, height: 0 });
  const animatedIndex = useRef(new Animated.Value<number>(0));
  const slowAnimatedIndex = useRef(withSpringTransition(animatedIndex.current));
  const animatedColour = interpolateColor(slowAnimatedIndex.current, {
    inputRange: props.carouselScreenProps.map((_, index) => index),
    outputRange: props.carouselScreenProps.map((button) => button.backgroundColour),
  });
  const renderItem = useCallback(
    ({ item, index }) => (
      <SwipeCarouselScreen
        item={{ ...item, onPressed: () => navigator.navigate(item.navigationPath) }}
        index={index}
        containerSize={carouselContainerSize}
        animatedIndex={animatedIndex.current}
        secondaryColour={animatedColour}
      />
    ),
    [carouselContainerSize]
  );
  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { backgroundColor: animatedColour }]}
      onLayout={(e) => setCarouselContainerSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
    >
      {carouselContainerSize.width !== 0 && carouselContainerSize.height !== 0 && (
        <Carousel
          data={props.carouselScreenProps}
          renderItem={renderItem}
          itemWidth={carouselContainerSize.width}
          itemHeight={carouselContainerSize.height}
          sliderWidth={carouselContainerSize.width}
          sliderHeight={carouselContainerSize.height}
          onScroll={(event) => {
            animatedIndex.current.setValue(event.nativeEvent.contentOffset.x / carouselContainerSize.width);
          }}
        />
      )}
    </Animated.View>
  );
};

export default connect(MapStateToProps, MapDispatchToProps)(SwipeCarousel);

const styles = StyleSheet.create({
  container: {},
});
