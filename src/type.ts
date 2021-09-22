type EnumValue<T> = T[keyof T];
const DirectionEnum = {
  up: 1,
  down: 2,
  left: 3,
  right: 4,
} as const;
type DirectionType = keyof typeof DirectionEnum;
type DirectionValue = EnumValue<typeof DirectionEnum>;
const GameItemEnum = {
  void: 0,
  user1: 1,
  user2: 2,
  enemyTank: 3,
  water: 4,
} as const;
type GameItemType = typeof GameItemEnum;
type GameItem = {
  type: EnumValue<typeof GameItemEnum>;
  direction?: DirectionValue;
};
type IGameItem = GameItem;
type GameRow = GameItem[];
type GameMap = GameRow[];
interface IGameRow {
  row: GameRow;
}
interface IGameMap {
  map: GameMap;
}
interface ITank {
  location: Location;
  type: TankType;
  direction: DirectionValue;
}

interface IGame {
  map: GameMap;
  isInited: boolean;
  userTanks: ITank[];
  enemyTanks: ITank[];
}

type TankType =
  | GameItemType["user1"]
  | GameItemType["user2"]
  | GameItemType["enemyTank"];
type MapSize = [col: number, row: number];
type Location = [x: number, y: number];

export { GameItemEnum, DirectionEnum };
export type {
  GameMap,
  GameItem,
  IGameItem,
  IGameMap,
  IGameRow,
  IGame,
  ITank,
  MapSize,
  Location,
  TankType,
  DirectionType,
  DirectionValue,
};
