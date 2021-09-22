import _ from "lodash";
import {
  DirectionEnum,
  DirectionValue,
  GameItem,
  GameItemEnum,
  GameMap,
  IGame,
  IGameItem,
  ITank,
  Location,
  MapSize,
} from "../type";

type Range = (start: number, end: number) => number[];
export const range: Range = (start, end) => {
  const length = end - start;
  return length > 0 ? [...Array(length).keys()].map((val) => val + start) : [];
};

type CreateMatrix = <T>([col, row]: [number, number], val: T) => T[][];
export const createMatrix: CreateMatrix = ([col, row], val) => {
  return range(0, row).map(() => range(0, col).map(() => val));
};

type SetMap = (map: GameMap, item: IGameItem, location: Location) => GameMap;
export const setMap: SetMap = (map, item, [x, y]) => {
  const cloneMap = _.cloneDeep(map);
  cloneMap[y][x] = item;

  return cloneMap;
};

type MoveLocation = (
  direction: DirectionValue,
  tank: ITank,
  map: GameMap
) => ITank;
export const moveLocation: MoveLocation = (direction, tank, gameMap) => {
  const canMove = canMapMove(gameMap);
  const [x, y] = tank.location;
  if (direction === DirectionEnum.up) {
    const location: Location = canMove([x, y - 1]) ? [x, y - 1] : [x, y];
    return {
      ...tank,
      location,
      direction,
    };
  } else if (direction === DirectionEnum.down) {
    const location: Location = canMove([x, y + 1]) ? [x, y + 1] : [x, y];
    return {
      ...tank,
      location,
      direction,
    };
  } else if (direction === DirectionEnum.left) {
    const location: Location = canMove([x - 1, y]) ? [x - 1, y] : [x, y];
    return {
      ...tank,
      location,
      direction,
    };
  } else if (direction === DirectionEnum.right) {
    const location: Location = canMove([x + 1, y]) ? [x + 1, y] : [x, y];
    return {
      ...tank,
      location,
      direction,
    };
  } else {
    const never: never = direction;
    return never;
  }
};

type CanMapMove = (gameMap: GameMap) => (location: Location) => boolean;
const canMapMove: CanMapMove =
  (gameMap) =>
  ([x, y]) => {
    const [width, height] = getMapSize(gameMap);
    const matchWidth = x >= 0 && x < width;
    const matchHeight = y >= 0 && y < height;
    if (!(matchWidth && matchHeight)) {
      return false;
    }

    const curtItemType = gameMap[y][x].type;
    const isVoid = curtItemType === GameItemEnum.void;

    return isVoid;
  };

type GetMapSize = (gameMap: GameMap) => MapSize;
export const getMapSize: GetMapSize = (gameMap) => {
  return [gameMap[0].length, gameMap.length];
};

type UpdateMap = (state: IGame) => IGame;
export const updateMap: UpdateMap = (state) => {
  const mapWithUserTank = state.userTanks.reduce(
    (prevMap, tank) => setMap(prevMap, tank, tank.location),
    state.map
  );
  const mapWithUserAndEnemyTank = state.enemyTanks.reduce(
    (prevMap, tank) => setMap(prevMap, tank, tank.location),
    mapWithUserTank
  );
  return {
    ...state,
    map: mapWithUserAndEnemyTank,
  };
};

type ChangeIthVal = <T>(arr: T[], item: T, i: number) => T[];
export const changeIthVal: ChangeIthVal = (arr, item, i) => {
  const newArr = _.cloneDeep(arr);
  newArr[i] = item;
  return newArr;
};
