import Bullet from "../class/bullet";
import Tank from "../class/tank";
import {
  ITank,
  IBullet,
  DirectionEnum,
  Location,
  GameItemEnum,
  GameMap,
  IGame,
  MapSize,
  SetStateMethod,
  TankType,
  DirectionValue,
} from "../type";
import {
  canMoveInMap,
  deepClearCurrentItem,
  isValidLocation,
  moveLocation,
  removeCurrentItem,
  setComplexItemInMap,
  updateMap,
} from "./map";
import { createMatrix, matrixMethods } from "./math";

type CreateBullet = (tank: ITank) => IBullet;
export const createBullet: CreateBullet = (tank) => {
  const { complexLocations, direction } = tank;
  const mapToMatrix = {
    [DirectionEnum.up]: [0, -1],
    [DirectionEnum.down]: [0, 2],
    [DirectionEnum.left]: [-1, 0],
    [DirectionEnum.right]: [2, 0],
  } as const;
  const matrix = mapToMatrix[direction];
  const basicLocation = complexLocations[0].location;
  const location: Location = [
    matrix[0] + basicLocation[0],
    matrix[1] + basicLocation[1],
  ];
  const bullet = new Bullet(location, direction);
  return bullet;
};

type CreateMap = (mapSize: MapSize) => SetStateMethod;
export const createMap: CreateMap =
  ([col, row]) =>
  (state) => {
    const map: GameMap = createMatrix([col, row], {
      type: GameItemEnum.void,
    });

    const curtState: IGame = {
      ...state,
      map,
      isInited: true,
    };
    return curtState;
  };

type CreateTank = (
  location: Location,
  type: TankType,
  direction: DirectionValue
) => SetStateMethod;
export const createTank: CreateTank =
  (location, type, direction) =>
  (state): IGame => {
    const tank: ITank = new Tank(location, type, direction);
    const pickState: Pick<IGame, "userTanks"> | Pick<IGame, "enemyTanks"> =
      type === GameItemEnum.user1 || type === GameItemEnum.user2
        ? {
            userTanks: state.userTanks.set(type, tank),
          }
        : {
            enemyTanks: state.enemyTanks.set(tank.id, tank),
          };

    const curtState = {
      ...state,
      ...pickState,
      map: setComplexItemInMap(state.map, tank),
    };

    // Warning!!!
    return curtState;
  };

type TankShoot = () => SetStateMethod;
export const tankShoot: TankShoot = () => (state) => {
  const bullet = createBullet(state.userTanks.get(GameItemEnum.user1)!);
  if (
    !bullet.complexLocations.every((item) =>
      isValidLocation(state.map, item.location)
    )
  ) {
    return state;
  }
  const bullets = state.bullets.set(bullet.id, bullet);
  const curtState = {
    ...state,
    bullets,
    map: setComplexItemInMap(state.map, bullet),
  };

  return curtState;
};

type MoveTank = (
  tankType: TankType,
  event: DirectionValue,
  enemyTankKey: number
) => SetStateMethod;
export const moveTank: MoveTank =
  (tankType, event, enemyTankKey) =>
  (state): IGame => {
    const i =
      tankType === GameItemEnum.user1 || tankType === GameItemEnum.user2
        ? tankType
        : enemyTankKey;
    if (!state.userTanks.has(i)) {
      return state;
    }
    const tank = state.userTanks.get(i)!;
    const curtTank = moveLocation(event, tank, state.map);
    const curtUserTanks = state.userTanks.set(i, curtTank);
    const newMap = updateMap(state.map, curtTank);
    const curtState = {
      ...state,
      map: newMap,
      userTanks: curtUserTanks,
    };
    return curtState;
  };

type MoveBullets = () => SetStateMethod;
export const moveBullets: MoveBullets = () => (state) => {
  const { bullets } = state;
  const updateBulletState = bullets.reduce((prevState, bullet) => {
    const i = bullet.id;
    if (!prevState.bullets.has(i)) {
      return prevState;
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

    if (!upedLocations.every((location) => isValidLocation(newMap, location))) {
      const curtBullets = prevState.bullets.remove(i);
      const curtState = {
        ...prevState,
        map: newMap,
        bullets: curtBullets,
      };
      return curtState;
    }

    const canMove = canMoveInMap(newMap);
    const canBulletMove = canMove(upedLocations);
    if (!canBulletMove) {
      const statebefore = {
        ...prevState,
        map: newMap,
      };
      const state = upedLocations.reduce(
        (state, location) => deepClearCurrentItem(state, location),
        statebefore
      );
      const curtBullets = state.bullets.remove(i);
      const curtState = {
        ...state,
        bullets: curtBullets,
      };
      return curtState;
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
    const curtBullets = prevState.bullets.set(i, curtBullet);
    const updatedMap = updateMap(newMap, curtBullet);
    const curtState = {
      ...prevState,
      map: updatedMap,
      bullets: curtBullets,
    };
    return curtState;
  }, state);

  return updateBulletState;
};
