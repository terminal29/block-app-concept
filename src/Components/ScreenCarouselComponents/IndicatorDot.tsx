import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Animated, { add, multiply, sub } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TapGestureHandler, State } from "react-native-gesture-handler";

interface IndicatorDotProps {
  progress: Animated.Node<number>;
  iconColor: Animated.Node<number>;
  iconName: string;
  onPressHandler?: () => void;
  screenAnimationProgress: Animated.Node<number>;
  option: boolean;
}

const defaultSize = {
  width: 30,
  height: 30,
};

const extraSize = 10;

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const IndicatorDot = (props: IndicatorDotProps) => {
  const squaredProgress = multiply(props.progress, props.progress);
  return true ? (
    <Animated.View
      style={[
        styles.container,
        {
          width: add(defaultSize.width, multiply(extraSize, props.progress)),
          height: add(defaultSize.height, multiply(extraSize, props.progress)),
          opacity: multiply(
            sub(1, props.screenAnimationProgress),
            add(0.5, multiply(0.5, props.progress))
          ),
        },
      ]}
    >
      <TapGestureHandler
        onHandlerStateChange={(state) =>
          state.nativeEvent.state == State.END && props.onPressHandler?.()
        }
      >
        <Animated.View
          style={[
            styles.innerContainer,
            {
              width: add(
                defaultSize.width,
                multiply(extraSize, squaredProgress)
              ),
              height: add(
                defaultSize.height,
                multiply(extraSize, squaredProgress)
              ),
            },
          ]}
        >
          <AnimatedIcon
            name={props.iconName}
            style={{
              fontSize: add(15, multiply(squaredProgress, 5)),
              color: props.iconColor,
            }}
          />
        </Animated.View>
      </TapGestureHandler>
    </Animated.View>
  ) : (
    <Animated.View
      style={[
        styles.container,
        {
          width: add(
            defaultSize.width - 20,
            multiply(extraSize - 5, props.progress)
          ),
          height: add(
            defaultSize.height - 20,
            multiply(extraSize - 5, props.progress)
          ),
          opacity: add(0.7, multiply(0.3, props.progress)),
        },
      ]}
    >
      <TapGestureHandler
        onHandlerStateChange={(state) =>
          state.nativeEvent.state == State.END && props.onPressHandler?.()
        }
      >
        <Animated.View
          style={[
            styles.innerContainer,
            {
              width: add(
                defaultSize.width - 20,
                multiply(extraSize - 5, squaredProgress)
              ),
              height: add(
                defaultSize.height - 20,
                multiply(extraSize - 5, squaredProgress)
              ),
            },
          ]}
        ></Animated.View>
      </TapGestureHandler>
    </Animated.View>
  );
};

export default IndicatorDot;

const styles = StyleSheet.create({
  container: {
    width: defaultSize.width,
    height: defaultSize.height,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    borderRadius: 1000,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
