import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  add,
  multiply,
  sub,
  block,
  cond,
  call,
  eq,
  neq,
  or,
  and,
  set,
  concat,
  defined,
  interpolate,
  Easing,
  clockRunning,
  startClock,
  timing,
  debug,
  stopClock,
  Clock,
} from "react-native-reanimated";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import { withTimingTransition, onGestureEvent, ReText, withSpringTransition } from "react-native-redash";
import { useRef } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AnimatedIcon from "./AnimatedIcon";

export interface CarouselScreenProps {
  accentColor: string;
  title: string;
  iconName: string;
  backgroundColor: string;
}

interface CarouselScreenPropsInt extends CarouselScreenProps {
  iconColor: Animated.Node<number>;
  cardSize: number;
  parentSize: { width: number; height: number };
  transitionAnimationProgress: Animated.Node<number>;
  initialState?: { startAt: boolean; goTo: boolean };
  onScreenPressed?: () => void;
  onScreenActivated?: () => void;
  onScreenActivationAnimationFinished?: (didOpen: boolean) => void;
}

interface CarouselScreenState {}

function runTiming(clock, value, dest) {
  const state = {
    finished: new Animated.Value(0),
    position: new Animated.Value(0),
    time: new Animated.Value(0),
    frameTime: new Animated.Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Animated.Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(
      clockRunning(clock),
      [
        // if the clock is already running we update the toValue, in case a new dest has been passed in
        set(config.toValue, dest),
      ],
      [
        // if the clock isn't running we reset all the animation params and start the clock
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ]
    ),
    // we run the step here that is going to update position
    timing(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, stopClock(clock)),
    // we made the block return the updated position
    state.position,
  ]);
}

export class CarouselScreen2 extends React.Component<CarouselScreenPropsInt> {
  pressState: Animated.Value<number>;
  prevPressState: Animated.Value<number>;
  animState: Animated.Value<number>;
  animProgress: Animated.Node<number>;
  lastAnimProgress: Animated.Value<number>;
  isPressed: Animated.Node<number>;
  pressProgress: Animated.Node<number>;
  clock: Animated.Clock;

  constructor(props: CarouselScreenPropsInt) {
    super(props);
    this.pressState = new Animated.Value(State.UNDETERMINED);
    this.prevPressState = new Animated.Value(State.UNDETERMINED);
    this.animState = new Animated.Value(props.initialState?.goTo ? 1 : 0);
    this.clock = new Clock();
    this.lastAnimProgress = new Animated.Value(props.initialState?.startAt ? 1 : 0);
    this.animProgress = runTiming(this.clock, this.lastAnimProgress, this.animState);

    if (props.transitionAnimationProgress) {
      this.animProgress = block([set(props.transitionAnimationProgress as Animated.Value<number>, this.animProgress), this.animProgress]);
    }

    if (props.onScreenActivationAnimationFinished) {
      this.animProgress = block([
        cond(and(neq(this.lastAnimProgress, this.animProgress), eq(this.animProgress, this.animState)), [
          cond(
            eq(this.animState, 1),
            call([], () => {
              props.onScreenActivationAnimationFinished?.(true);
            })
          ),
          cond(
            eq(this.animState, 0),
            call([], () => {
              props.onScreenActivationAnimationFinished?.(false);
            })
          ),
        ]),
        this.animProgress,
      ]);
    }

    this.animProgress = block([set(this.lastAnimProgress, this.animProgress), this.animProgress]);

    this.isPressed = block([
      cond(
        neq(this.pressState, this.prevPressState),
        block([
          cond(eq(this.pressState, State.END), [call([], () => props.onScreenActivated?.())]),
          cond(
            eq(this.pressState, State.BEGAN),
            call([], () => props.onScreenPressed?.())
          ),
        ])
      ),
      set(this.prevPressState, this.pressState),
      cond(eq(this.pressState, State.BEGAN), 1, 0),
    ]);

    this.pressProgress = withSpringTransition(this.isPressed, {
      mass: 0.1,
    });
  }

  private animInterp(a: Animated.Adaptable<number>, b: Animated.Adaptable<number>) {
    return interpolate(this.animProgress, {
      inputRange: [0, 1],
      outputRange: [a, b],
    });
  }

  public triggerOpenAnimation() {
    this.animState.setValue(1);
  }

  public triggerCloseAnimation() {
    this.animState.setValue(0);
  }

  private debugView() {
    return <ReText text={concat(this.animState, "-", this.animProgress)} style={{ position: "absolute", left: 20, top: 20 }} />;
  }

  componentDidMount() {}

  render() {
    const props = this.props;
    return (
      <View style={[styles.container]}>
        {this.debugView()}
        <Animated.View
          style={[
            styles.cardContainer,
            {
              width: this.animInterp(props.cardSize || 0, props.parentSize.width),
              height: this.animInterp(props.cardSize || 0, props.parentSize.height),
              padding: this.animInterp(add(60, multiply(this.pressProgress, -10)), 0),
              paddingTop: this.animInterp(add(60, multiply(this.pressProgress, -10)), 50),
              top: this.animInterp(-60, 0),
            },
          ]}
        >
          <TapGestureHandler
            onHandlerStateChange={Animated.event([
              {
                nativeEvent: {
                  state: this.pressState,
                },
              },
            ])}
          >
            <Animated.View
              style={[
                styles.innerContainer,
                {
                  borderBottomLeftRadius: this.animInterp(styles.innerContainer.borderRadius, 0),
                  borderBottomRightRadius: this.animInterp(styles.innerContainer.borderRadius, 0),
                },
              ]}
            >
              <AnimatedIcon
                style={[
                  styles.iconStyle,
                  {
                    transform: [
                      {
                        scale: add(1, multiply(this.pressProgress, 0.1)),
                      },
                    ],
                    borderRadius: 50,
                    opacity: this.animInterp(1, 0),
                    color: this.props.iconColor,
                  },
                ]}
                name={props.iconName}
                size={200}
              />
            </Animated.View>
          </TapGestureHandler>
          <Animated.Text
            style={[
              styles.titleStyle,
              {
                backgroundColor: props.accentColor,
                top: this.animInterp(add(30, multiply(10, sub(1, this.pressProgress))), 30),
                left: this.animInterp(add(100, multiply(-7, this.pressProgress)), 50),
              },
            ]}
          >
            {props.title}
          </Animated.Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    padding: 20,
    margin: 40,
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
  },
  iconStyle: {},
});
