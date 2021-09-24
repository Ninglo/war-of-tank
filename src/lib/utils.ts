import _, { map } from "lodash";
import Bullet from "../class/bullet";
import {
  DirectionEnum,
  DirectionValue,
  GameItem,
  GameItemEnum,
  GameMap,
  IBullet,
  IGameItem,
  IMoveItem,
  ITank,
  Location,
  MapSize,
  Matrix,
} from "../type";

type Range = (start: number, end: number) => number[];
export const range: Range = (start, end) => {
  const length = end - start;
  return length > 0 ? [...Array(length).keys()].map((val) => val + start) : [];
};

type CreateMatrix = <T>([col, row]: MapSize, val: T) => Matrix<T>;
export const createMatrix: CreateMatrix = ([col, row], val) => {
  return range(0, row).map(() => range(0, col).map(() => val));
};

type SetItemInMap = (
  map: GameMap,
  item: IGameItem,
  location: Location
) => GameMap;
export const setItemInMap: SetItemInMap = (map, item, [x, y]) => {
  const cloneMap = _.cloneDeep(map);
  cloneMap[y][x] = item;

  return cloneMap;
};

type SetComplexItemInMap = (map: GameMap, item: IMoveItem) => GameMap;
export const setComplexItemInMap: SetComplexItemInMap = (map, item) => {
  return item.complexLocations.reduce(
    (prevMap, { location, locationType }) =>
      setItemInMap(prevMap, { type: item.type, locationType }, location),
    map
  );
};

type MoveLocation = <T extends IMoveItem>(
  direction: DirectionValue,
  item: T,
  map: GameMap
) => T;
export const moveLocation: MoveLocation = (direction, item, gameMap) => {
  const newMap = removeCurrentItem(gameMap, item.complexLocations[0].location);
  const canMove = canMoveInMap(newMap);
  const prevLocations = item.complexLocations.map(({ location }) => location);
  const upedLocations = matrix[direction](prevLocations);
  const locations: Location[] = canMove(upedLocations)
    ? upedLocations
    : prevLocations;
  const complexLocations: typeof item["complexLocations"] =
    item.complexLocations.map((complexLocation, i) => {
      const location = locations[i];
      return {
        ...complexLocation,
        prevLocation: complexLocation.location,
        location,
      };
    });
  const res: typeof item = {
    ...item,
    complexLocations,
    direction,
  };
  return res;
};

type RemoveCurrentItem = (map: GameMap, location: Location) => GameMap;
const removeCurrentItem: RemoveCurrentItem = (map, [x, y]) => {
  const item = map[y][x];
  //TODO something wrong here!!!!!
  if (item.type === GameItemEnum.void) {
    return map;
  }

  const newMap = _.cloneDeep(map);
  type DFS = <T extends GameItem>(
    map: GameMap,
    location: Location,
    item: T
  ) => void;
  const dfs: DFS = (map, [x, y], item) => {
    const stack: Location[] = [[x, y]];
    while (stack.length) {
      const [x, y] = stack.pop()!;
      if (!isValidLocation(map, [x, y])) {
        continue;
      }
      const curtItem = map[y][x];
      if (item.type === curtItem.type) {
        map[y][x] = { type: GameItemEnum.void };
        stack.push([x - 1, y]);
        stack.push([x + 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }
  };
  dfs(newMap, [x, y], item);
  return newMap;
};

type IsValidLocation = (gameMap: GameMap, location: Location) => boolean;
export const isValidLocation: IsValidLocation = (gameMap, [x, y]) => {
  const [width, height] = getMapSize(gameMap);
  const matchWidth = x >= 0 && x < width;
  const matchHeight = y >= 0 && y < height;

  return matchWidth && matchHeight;
};

type CanMoveInMap = (gameMap: GameMap) => (locations: Location[]) => boolean;
type CanMove = (location: Location) => boolean;
const canMoveInMap: CanMoveInMap = (gameMap) => (locations) => {
  const canMove: CanMove = ([x, y]) => {
    if (!isValidLocation(gameMap, [x, y])) {
      return false;
    }

    const curtItemType = gameMap[y][x].type;
    const isVoid = curtItemType === GameItemEnum.void;

    return isVoid;
  };

  return locations.every(canMove);
};

type GetMapSize = (gameMap: GameMap) => MapSize;
export const getMapSize: GetMapSize = (gameMap) => {
  return [gameMap[0].length, gameMap.length];
};

type UpdateMap = (gameMap: GameMap, item: IMoveItem) => GameMap;
export const updateMap: UpdateMap = (map, item) => {
  const mapWithoutItem = removeCurrentItem(
    map,
    item.complexLocations[0].prevLocation
  );
  const mapWithUpdatedItem = setComplexItemInMap(mapWithoutItem, item);

  return mapWithUpdatedItem;
};

type ChangeIthVal = <T>(arr: T[], item: T, i: number) => T[];
export const changeIthVal: ChangeIthVal = (arr, item, i) => {
  const newArr = _.cloneDeep(arr);
  newArr[i] = item;
  return newArr;
};

export const matrix = {
  [DirectionEnum.up]: (locations: Location[]) => {
    return locations.map(([x, y]): Location => [x, y - 1]);
  },
  [DirectionEnum.down]: (locations: Location[]) => {
    return locations.map(([x, y]): Location => [x, y + 1]);
  },
  [DirectionEnum.left]: (locations: Location[]) => {
    return locations.map(([x, y]): Location => [x - 1, y]);
  },
  [DirectionEnum.right]: (locations: Location[]) => {
    return locations.map(([x, y]): Location => [x + 1, y]);
  },
};

type GetBulletLocation = (tank: ITank) => IBullet;
export const getBulletLocation: GetBulletLocation = (tank) => {
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
