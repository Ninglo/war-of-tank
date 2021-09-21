import _ from "lodash";
import type {
  GameMap,
  IGameItem,
  KeyboardMoveEvent,
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
  event: KeyboardMoveEvent,
  location: Location,
  mapSize: MapSize
) => Location;
export const moveLocation: MoveLocation = (event, [x, y], [width, height]) => {
  if (event === "ArrowUp") {
    return y > 0 ? [x, y - 1] : [x, y];
  } else if (event === "ArrowDown") {
    return y < height - 1 ? [x, y + 1] : [x, y];
  } else if (event === "ArrowLeft") {
    return x > 0 ? [x - 1, y] : [x, y];
  } else if (event === "ArrowRight") {
    return x < width - 1 ? [x + 1, y] : [x, y];
  } else {
    const never: never = event;
    return never;
  }
};

type GetMapSize = (gameMap: GameMap) => MapSize;
export const getMapSize: GetMapSize = (gameMap) => {
  return [gameMap[0].length, gameMap.length];
};
