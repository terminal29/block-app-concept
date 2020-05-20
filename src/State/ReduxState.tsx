import { Block } from "../Structs/Block";
import { SwipeCarouselScreenProps } from "../Components/Carousel/SwipeCarouselScreen";

export default interface ReduxState {
  readonly blocks: Array<Block>;
  readonly carouselScreenProps: Array<SwipeCarouselScreenProps>;
}
