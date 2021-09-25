import createSlice from "redux-prim";
import { IGame, MapSize, Location, TankType, DirectionValue } from "../type";
import {
  createMap,
  createTank,
  moveBullets,
  moveTank,
  tankShoot,
} from "../pure/event";
import { List, Map } from "immutable";

type GameDefaultState = () => IGame;
const getDefaultState: GameDefaultState = () => ({
  map: List(List()),
  isInited: false,
  userTanks: Map(),
  enemyTanks: Map(),
  bullets: Map(),
});

export const { actions, selector, reducer } = createSlice(
  "game",
  getDefaultState,
  ({ setState }) => {
    return {
      createMap(mapSize: MapSize) {
        return setState(createMap(mapSize));
      },
      createTank(
        location: Location,
        type: TankType,
        direction: DirectionValue
      ) {
        return setState(createTank(location, type, direction));
      },
      moveTank(
        tankType: TankType,
        event: DirectionValue,
        enemyTankIndex: number
      ) {
        return setState(moveTank(tankType, event, enemyTankIndex));
      },
      tankShoot() {
        return setState(tankShoot());
      },
      moveBullets() {
        return setState(moveBullets());
      },
    };
  }
);
