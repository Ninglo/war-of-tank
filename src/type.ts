const GameItemNameEnum = {
  void: 0,
  tank: 1,
} as const;
type GameItemName = typeof GameItemNameEnum[keyof typeof GameItemNameEnum];
type StaticItemName = Exclude<GameItemName, typeof GameItemNameEnum["tank"]>;
interface IGameItem<T = GameItemName> {
  name: T;
}
type GameRow = IGameItem[];
type GameMap = GameRow[];
interface IGameRow {
  row: GameRow;
}
interface IGameMap {
  map: GameMap;
}
interface ITank extends IGameItem {
  location: Location;
}
type StaticMap = IGameItem<StaticItemName>[][];

interface IGame {
  map: GameMap;
  isInited: boolean;
  tanks: ITank[];
}

type KeyboardMoveEvent = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";
type MapSize = [col: number, row: number];
type Location = [x: number, y: number];

export { GameItemNameEnum };
export type {
  GameMap,
  StaticMap,
  IGameMap,
  IGameItem,
  IGameRow,
  IGame,
  ITank,
  MapSize,
  Location,
  KeyboardMoveEvent,
};
