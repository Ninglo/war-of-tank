const GameItemNameEnum = {
  void: 0,
  tank: 1,
} as const;
type GameItemName = typeof GameItemNameEnum[keyof typeof GameItemNameEnum];

interface IGameItem {
  name: GameItemName;
}

type GameRow = IGameItem[];
type GameMap = GameRow[];
interface IGameRow {
  row: GameRow;
}
interface IGameMap {
  map: GameMap;
}

interface IGame {
  map: GameMap;
  isInited: boolean;
}

type MapSize = [col: number, row: number];

export { GameItemNameEnum };
export type { IGameMap, IGameItem, IGameRow, IGame, MapSize };
