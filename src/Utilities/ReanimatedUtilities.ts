import Animated, { max } from "react-native-reanimated";

export function nodeArrayMax(values: Animated.Node<number>[], lastValue?: Animated.Node<number>): Animated.Node<number> {
  if (values.length === 0) {
    if (!lastValue) {
      throw Error("arrayMax needs values to be supplied");
    }
    return lastValue;
  }
  if (!lastValue) {
    return nodeArrayMax(values.slice(1), values[0]);
  }
  return nodeArrayMax(values.slice(1), max(values[0], lastValue));
}

export function hexToRGB(hex: string): number[] {
  var h = "0123456789ABCDEF";
  var r = h.indexOf(hex[1]) * 16 + h.indexOf(hex[2]);
  var g = h.indexOf(hex[3]) * 16 + h.indexOf(hex[4]);
  var b = h.indexOf(hex[5]) * 16 + h.indexOf(hex[6]);
  return [r, g, b];
}
