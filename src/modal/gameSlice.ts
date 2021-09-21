import createSlice from "redux-prim";
import {
  createMatrix,
  getMapSize,
  moveLocation,
  range,
  setMap,
} from "../lib/utils";
import {
  GameItemNameEnum,
  IGame,
  IGameMap,
  MapSize,
  Location,
  KeyboardMoveEvent,
} from "../type";

type PartialState = Partial<IGame>;

type GameDefaultState = () => IGame;
const getDefaultState: GameDefaultState = () => ({
  map: [[]],
  isInited: false,
  tanks: [],
});

export const { actions, selector, reducer } = createSlice(
  "game",
  getDefaultState,
  ({ initState, mergeState, setState }) => {
    return {
      createMap([col, row]: MapSize) {
        return setState((state) => {
          const map: IGame["map"] = createMatrix([col, row], {
            name: GameItemNameEnum.void,
          });
          const curtState: IGame = {
            ...state,
            map: map,
            isInited: true,
          };
          return curtState;
        });
      },
      createTank(location: Location) {
        return setState((state) => {
          const curtState: IGame = {
            ...state,
            tanks: [...state.tanks, { name: GameItemNameEnum.tank, location }],
          };

          return curtState;
        });
      },
      moveTank(event: KeyboardMoveEvent) {
        return setState((state) => {
          const mapSize = getMapSize(state.map);
          const tanks = state.tanks.map((tank) => ({
            ...tank,
            location: moveLocation(event, tank.location, mapSize),
          }));

          const curtState: IGame = {
            ...state,
            tanks,
          };

          return curtState;
        });
      },
    };
  }
);
