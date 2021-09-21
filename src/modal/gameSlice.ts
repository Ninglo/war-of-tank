import createSlice from "redux-prim";
import { createMatrix, range } from "../lib/utils";
import { GameItemNameEnum, IGame, IGameMap, MapSize } from "../type";

type GameDefaultState = () => IGame;
const getDefaultState: GameDefaultState = () => ({
  map: [[]],
  isInited: false,
});

export const { actions, selector, reducer } = createSlice(
  "game",
  getDefaultState,
  ({ initState, mergeState, setState }) => {
    return {
      createMap([col, row]: MapSize) {
        const map: IGameMap["map"] = createMatrix([col, row], {
          name: GameItemNameEnum.void,
        });
        const state: IGame = {
          map: map,
          isInited: true,
        };
        return setState(state);
      },
    };
  }
);
