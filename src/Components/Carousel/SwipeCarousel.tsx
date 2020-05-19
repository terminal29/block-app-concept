import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useState, useCallback, useRef } from "react";
import SwipeCarouselScreen, { SwipeCarouselScreenProps } from "./SwipeCarouselScreen";
import Carousel from "react-native-snap-carousel";
import Animated from "react-native-reanimated";
import { interpolateColor, withSpringTransition } from "react-native-redash";

interface SwipeCarouselProps {
  buttons: SwipeCarouselScreenProps[];
}

const SwipeCarousel = (props: SwipeCarouselProps) => {
  const [carouselContainerSize, setCarouselContainerSize] = useState({ width: 0, height: 0 });
  const animatedIndex = useRef(new Animated.Value<number>(0));
  const slowAnimatedIndex = useRef(withSpringTransition(animatedIndex.current));
  const animatedColour = interpolateColor(slowAnimatedIndex.current, {
    inputRange: props.buttons.map((_, index) => index),
    outputRange: props.buttons.map((button) => button.backgroundColour),
  });
  const renderItem = useCallback(
    ({ item, index }) => (
      <SwipeCarouselScreen item={item} index={index} containerSize={carouselContainerSize} animatedIndex={animatedIndex.current} secondaryColour={animatedColour} />
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
          data={props.buttons}
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

export default SwipeCarousel;

const styles = StyleSheet.create({
  container: {},
});
