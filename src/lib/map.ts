import { matrixMethods } from "./math";
import {
  DirectionValue,
  GameItem,
  GameItemEnum,
  GameMap,
  IGameItem,
  IMoveItem,
  Location,
  MapSize,
} from "../type";

type SetItemInMap = (
  map: GameMap,
  item: IGameItem,
  location: Location
) => GameMap;
export const setItemInMap: SetItemInMap = (map, item, [x, y]) => {
  return map.setIn([y, x], item);
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
  const upedLocations = matrixMethods[direction](prevLocations);
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
export const removeCurrentItem: RemoveCurrentItem = (map, [x, y]) => {
  const item = map.get(y)!.get(x)!;
  //TODO something wrong here!!!!!
  if (item.type === GameItemEnum.void || item.type === GameItemEnum.iron) {
    return map;
  }

  type DFS = <T extends GameItem>(
    map: GameMap,
    location: Location,
    item: T
  ) => GameMap;
  const dfs: DFS = (map, [x, y], item) => {
    let newMap = map;
    const stack: Location[] = [[x, y]];
    while (stack.length) {
      const [x, y] = stack.pop()!;
      if (!isValidLocation(newMap, [x, y])) {
        continue;
      }
      const curtItem = newMap.get(y)!.get(x)!;
      if (item.type === curtItem.type) {
        newMap = setItemInMap(newMap, { type: GameItemEnum.void }, [x, y]);
        stack.push([x - 1, y]);
        stack.push([x + 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }

    return newMap;
  };

  return dfs(map, [x, y], item);
};

type IsValidLocation = (gameMap: GameMap, location: Location) => boolean;
export const isValidLocation: IsValidLocation = (gameMap, [x, y]) => {
  const [width, height] = getMapSize(gameMap);
  const matchWidth = x >= 0 && x < width;
  const matchHeight = y >= 0 && y < height;

  return matchWidth && matchHeight;
};

type CanMove = (location: Location) => boolean;
type CanMoveInMap = (gameMap: GameMap) => (locations: Location[]) => boolean;
export const canMoveInMap: CanMoveInMap = (gameMap) => (locations) => {
  const canMove: CanMove = ([x, y]) => {
    if (!isValidLocation(gameMap, [x, y])) {
      return false;
    }

    const curtItemType = gameMap.get(y)!.get(x)!.type;
    const isVoid = curtItemType === GameItemEnum.void;

    return isVoid;
  };

  return locations.every(canMove);
};

type GetMapSize = (gameMap: GameMap) => MapSize;
export const getMapSize: GetMapSize = (gameMap) => {
  return [gameMap.get(0)!.size, gameMap.size];
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
