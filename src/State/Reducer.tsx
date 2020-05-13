import ActionType from "./ActionType";
import produce, { Draft } from "immer";
import ReduxState from "./ReduxState";
import { Block } from "../Structs/Block";

export default function Reducer(state: ReduxState, action: any) {
  return produce(state, (draft: Draft<ReduxState>) => {
    switch (action.type) {
      case ActionType.BLOCK_ADDED:
        {
          draft.blocks = [...draft.blocks, action.payload.block as Block];
        }
        break;
      case ActionType.BLOCK_REMOVED:
        {
          draft.blocks = draft.blocks.filter(
            (block: Block) => block.id !== (action.payload.block as Block).id
          );
        }
        break;
    }
    return draft;
  });
}
