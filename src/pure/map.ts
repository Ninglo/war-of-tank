import { matrixMethods } from "./math";
import {
  DirectionValue,
  GameItem,
  GameItemEnum,
  GameMap,
  IGame,
  IGameItem,
  IMoveItem,
  Location,
  MapSize,
} from "../type";
import { clearItem, isSame } from "./data";

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
      setItemInMap(
        prevMap,
        { type: item.type, locationType, id: item.id },
        location
      ),
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

type DeepClearCurrentItem = (state: IGame, location: Location) => IGame;
export const deepClearCurrentItem: DeepClearCurrentItem = (state, location) => {
  const { map } = state;
  const item = getItem(map, location);
  if (
    [
      GameItemEnum.bullet,
      GameItemEnum.user1,
      GameItemEnum.user2,
      GameItemEnum.enemyTank,
    ].some(isSame(item.type))
  ) {
    const curtMap = removeCurrentItem(map, location);
    const curtState = clearItem(state, item as IMoveItem);
    return {
      ...curtState,
      map: curtMap,
    };
  } else {
    const res = {
      ...state,
      map: removeCurrentItem(map, location),
    };
    return res;
  }
};

type RemoveCurrentItem = (map: GameMap, location: Location) => GameMap;
export const removeCurrentItem: RemoveCurrentItem = (map, location) => {
  const item = getItem(map, location);
  //TODO something wrong here!!!!!
  if (
    [GameItemEnum.void, GameItemEnum.water, GameItemEnum.iron].some(
      (type) => type === item.type
    )
  ) {
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
      const curtItem = getItem(newMap, [x, y]);
      if (item.type === curtItem.type && item.id === curtItem.id) {
        newMap = setItemInMap(newMap, { type: GameItemEnum.void }, [x, y]);
        isValidLocation(newMap, [x - 1, y]) && stack.push([x - 1, y]);
        isValidLocation(newMap, [x + 1, y]) && stack.push([x + 1, y]);
        isValidLocation(newMap, [x, y + 1]) && stack.push([x, y + 1]);
        isValidLocation(newMap, [x, y - 1]) && stack.push([x, y - 1]);
      }
    }

    return newMap;
  };

  return dfs(map, location, item);
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

    const curtItemType = getItem(gameMap, [x, y]).type;
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

type GetItem = (map: GameMap, location: Location) => GameItem;
export const getItem: GetItem = (map, [x, y]) => map.get(y)!.get(x)!;
