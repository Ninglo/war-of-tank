import createSlice from "redux-prim";
import {
  changeIthVal,
  createMatrix,
  getBulletLocation,
  isValidLocation,
  moveLocation,
  setComplexItemInMap,
  updateMap,
} from "../lib/utils";
import Tank from "../class/tank";
import {
  GameItemEnum,
  IGame,
  MapSize,
  Location,
  TankType,
  ITank,
  GameMap,
  DirectionValue,
  IBullet,
} from "../type";

// type PartialState = Partial<IGame>;

type GameDefaultState = () => IGame;
const getDefaultState: GameDefaultState = () => ({
  map: [[]],
  isInited: false,
  userTanks: [],
  enemyTanks: [],
  bullets: [],
});

export const { actions, selector, reducer } = createSlice(
  "game",
  getDefaultState,
  ({ initState, mergeState, setState }) => {
    return {
      createMap([col, row]: MapSize) {
        return setState((state): IGame => {
          const map: GameMap = createMatrix([col, row], {
            type: GameItemEnum.void,
          });
          const curtState: IGame = {
            ...state,
            map: map,
            isInited: true,
          };
          return curtState;
        });
      },
      createBullet() {
        return setState((state): IGame => {
          const bullet = getBulletLocation(state.userTanks[0]);
          if (
            !bullet.complexLocations.every((item) =>
              isValidLocation(state.map, item.location)
            )
          ) {
            return state;
          }
          const bullets = [...state.bullets, bullet];
          const curtState = {
            ...state,
            bullets,
            map: setComplexItemInMap(state.map, bullet),
          };

          return curtState;
        });
      },
      createTank(
        location: Location,
        type: TankType,
        direction: DirectionValue
      ) {
        return setState((state): IGame => {
          const tank: ITank = new Tank(location, type, direction);
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

          const curtState = {
            ...state,
            ...pickState,
            map: setComplexItemInMap(state.map, tank),
          };

          // Warning!!!
          return curtState;
        });
      },
      moveTank(
        tankType: TankType,
        event: DirectionValue,
        enemyTankIndex: number
      ) {
        return setState((state): IGame => {
          if (
            tankType === GameItemEnum.user1 ||
            tankType === GameItemEnum.user2
          ) {
            const updateTanksState = state.userTanks.reduce(
              (prevState, tank, i) => {
                if (tank.type !== tankType) {
                  return prevState;
                }
                const curtMap = setComplexItemInMap(prevState.map, tank);
                const curtTank = moveLocation(event, tank, curtMap);
                const curtUserTanks = changeIthVal(
                  prevState.userTanks,
                  curtTank,
                  i
                );
                const newMap = updateMap(prevState.map, curtTank);
                const curtState = {
                  ...prevState,
                  map: newMap,
                  userTanks: curtUserTanks,
                };
                return curtState;
              },
              state
            );

            return updateTanksState;
          } else {
            return state.enemyTanks.reduce((prevState, tank, i) => {
              if (i !== enemyTankIndex) {
                return prevState;
              }
              const curtMap = setComplexItemInMap(prevState.map, tank);
              const curtTank = moveLocation(event, tank, curtMap);
              const curtUserTanks = changeIthVal(
                prevState.enemyTanks,
                curtTank,
                i
              );
              const newMap = updateMap(prevState.map, curtTank);
              const curtState = {
                ...prevState,
                map: newMap,
                userTanks: curtUserTanks,
              };
              return curtState;
            }, state);
          }
        });
      },
      moveBullet(event: DirectionValue, bulletIndex: number) {
        return setState((state): IGame => {
          const updateBulletState = state.bullets.reduce(
            (prevState, bullet, i) => {
              if (i !== bulletIndex) {
                return prevState;
              }
              const curtMap = setComplexItemInMap(prevState.map, bullet);
              const curtBullet = moveLocation(event, bullet, curtMap);
              const curtBullets = changeIthVal(
                prevState.bullets,
                curtBullet,
                i
              );
              const newMap = updateMap(prevState.map, curtBullet);
              const curtState = {
                ...prevState,
                map: newMap,
                bullets: curtBullets,
              };
              return curtState;
            },
            state
          );

          return updateBulletState;
        });
      },
    };
  }
);
