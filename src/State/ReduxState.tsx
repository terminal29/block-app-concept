import { Block } from "../Structs/Block";

export default interface ReduxState {
  readonly blocks: Array<Block>;
}
