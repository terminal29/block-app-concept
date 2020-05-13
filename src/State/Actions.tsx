import { Block } from "../Structs/Block";
import ActionType from "./ActionType";

const RemoveBlockAction = (block: Block) => ({
  type: ActionType.BLOCK_REMOVED,
  payload: { block },
});

export default { RemoveBlockAction };
