import createSlice from "redux-prim";
import {
  changeIthVal,
  createMatrix,
  moveLocation,
  setMap,
  updateMap,
} from "../lib/utils";
import {
  GameItemEnum,
  IGame,
  MapSize,
  Location,
  TankType,
  ITank,
  GameMap,
  DirectionValue,
} from "../type";

// type PartialState = Partial<IGame>;

type GameDefaultState = () => IGame;
const getDefaultState: GameDefaultState = () => ({
  map: [[]],
  isInited: false,
  userTanks: [],
  enemyTanks: [],
});

export const { actions, selector, reducer } = createSlice(
  "game",
  getDefaultState,
  ({ initState, mergeState, setState }) => {
    return {
      createMap([col, row]: MapSize) {
        return setState((state) => {
          const map: GameMap = createMatrix([col, row], {
            type: GameItemEnum.void,
          });
          const curtState: IGame = {
            ...state,
            map: map,
            isInited: true,
          };
          curtState.map[3][3] = { type: 3 };
          return curtState;
        });
      },
      createTank(
        location: Location,
        type: TankType,
        direction: DirectionValue
      ) {
        return setState((state) => {
          const tank: ITank = { location, type, direction };
          const pickState:
            | Pick<IGame, "userTanks">
            | Pick<IGame, "enemyTanks"> =
            type === GameItemEnum.user1 || type === GameItemEnum.user2
              ? {
                  userTanks: [...state.userTanks, tank],
                }
              : {
                  enemyTanks: [...state.enemyTanks, tank],
                };

          const curtState: IGame = {
            ...state,
            ...pickState,
            map: setMap(state.map, { type }, tank.location),
          };

          return updateMap(curtState);
        });
      },
      moveTank(tankType: TankType, event: DirectionValue[]) {
        return setState((state) => {
          if (
            tankType === GameItemEnum.user1 ||
            tankType === GameItemEnum.user2
          ) {
            const updateTanksState = state.userTanks.reduce(
              (prevState, tank, i) => {
                if (tank.type !== tankType) {
                  return prevState;
                }
                const curtMap = setMap(
                  prevState.map,
                  { type: GameItemEnum.void },
                  tank.location
                );
                const curtUserTanks = changeIthVal(
                  prevState.userTanks,
                  moveLocation(event[0], tank, curtMap),
                  i
                );
                return {
                  ...prevState,
                  map: curtMap,
                  userTanks: curtUserTanks,
                };
              },
              state
            );
            const updateMapState = updateMap(updateTanksState);

            return updateMapState;
          } else {
            state.enemyTanks.reduce((prevState, tank, i) => {
              const enemyTanks = changeIthVal(
                prevState.enemyTanks,
                moveLocation(event[i], tank, prevState.map),
                i
              );
              const updateEnemyTankState: IGame = {
                ...state,
                enemyTanks,
              };

              return updateMap(updateEnemyTankState);
            }, state);
          }
        });
      },
    };
  }
);
