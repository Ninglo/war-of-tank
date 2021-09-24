import createSlice from "redux-prim";
import {
  canMoveInMap,
  isValidLocation,
  moveLocation,
  removeCurrentItem,
  setComplexItemInMap,
  updateMap,
} from "../lib/map";
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
import { changeIthVal, removeKthVal } from "../lib/data";
import { getBulletLocation } from "../lib/event";
import { createMatrix, matrixMethods } from "../lib/math";
import { List } from "immutable";

type GameDefaultState = () => IGame;
const getDefaultState: GameDefaultState = () => ({
  map: List(List()),
  isInited: false,
  userTanks: List(),
  enemyTanks: List(),
  bullets: List(),
});

export const { actions, selector, reducer } = createSlice(
  "game",
  getDefaultState,
  ({ setState }) => {
    return {
      createMap([col, row]: MapSize) {
        return setState((state): IGame => {
          const map: GameMap = createMatrix([col, row], {
            type: GameItemEnum.void,
          });

          const curtState: IGame = {
            ...state,
            map: map.setIn([3, 3], { type: GameItemEnum.water }),
            isInited: true,
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
                  userTanks: state.userTanks.push(tank),
                }
              : {
                  enemyTanks: state.enemyTanks.push(tank),
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
          const i =
            tankType === GameItemEnum.user1 || tankType === GameItemEnum.user2
              ? tankType === GameItemEnum.user1
                ? 0
                : 1
              : enemyTankIndex;
          const tank = state.userTanks.get(i)!;
          const curtTank = moveLocation(event, tank, state.map);
          const curtUserTanks = changeIthVal(state.userTanks, curtTank, i);
          const newMap = updateMap(state.map, curtTank);
          const curtState = {
            ...state,
            map: newMap,
            userTanks: curtUserTanks,
          };
          return curtState;
        });
      },
      createBullet() {
        return setState((state): IGame => {
          const bullet = getBulletLocation(state.userTanks.get(0)!);
          if (
            !bullet.complexLocations.every((item) =>
              isValidLocation(state.map, item.location)
            )
          ) {
            return state;
          }
          const bullets = state.bullets.push(bullet);
          const curtState = {
            ...state,
            bullets,
            map: setComplexItemInMap(state.map, bullet),
          };

          return curtState;
        });
      },
      moveBullets() {
        return setState((state): IGame => {
          const { bullets } = state;
          const [updateBulletState, curtBullets] = bullets.reduce(
            ([prevState, list], bullet, i) => {
              if (!bullet) {
                console.log(state);
                console.log(bullets);
                return [prevState, list];
              }
              const { direction } = bullet;
              const newMap = removeCurrentItem(
                prevState.map,
                bullet.complexLocations[0].location
              );
              const prevLocations = bullet.complexLocations.map(
                ({ location }) => location
              );
              const upedLocations = matrixMethods[direction](prevLocations);
              if (
                !upedLocations.every((location) =>
                  isValidLocation(newMap, location)
                )
              ) {
                const curtBullets = removeKthVal(prevState.bullets, i);
                const curtState = {
                  ...prevState,
                  map: newMap,
                  bullets: curtBullets,
                };
                return [curtState, list];
              }
              const canMove = canMoveInMap(newMap);
              const canBulletMove = canMove(upedLocations);
              if (!canBulletMove) {
                const curtMap = upedLocations.reduce(
                  (prevMap, location) => removeCurrentItem(prevMap, location),
                  newMap
                );
                const curtBullets = removeKthVal(prevState.bullets, i);
                const curtState = {
                  ...prevState,
                  map: curtMap,
                  bullets: curtBullets,
                };
                return [curtState, list];
              }
              const locations = upedLocations;

              const complexLocations = bullet.complexLocations.map(
                (complexLocation, i) => {
                  const location = locations[i];
                  return {
                    ...complexLocation,
                    prevLocation: complexLocation.location,
                    location,
                  };
                }
              );
              const curtBullet = {
                ...bullet,
                complexLocations,
                direction,
              };
              const curtBullets = list.push(curtBullet);
              const updatedMap = updateMap(newMap, curtBullet);
              const curtState = {
                ...prevState,
                map: updatedMap,
                bullets: curtBullets,
              };
              return [curtState, curtBullets];
            },
            [state, List<IBullet>()] as const
          );

          return {
            ...updateBulletState,
            bullets: curtBullets,
          };
        });
      },
    };
  }
);
