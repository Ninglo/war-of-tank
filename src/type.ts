const GameItemEnum = {
  void: 0,
  user1: 1,
  user2: 2,
  enemyTank: 3,
  water: 4,
} as const
type GameItemType = typeof GameItemEnum
type GameItem = typeof GameItemEnum[keyof typeof GameItemEnum]
interface IGameItem {
  name: GameItem
}
type GameRow = GameItem[]
type GameMap = GameRow[]
interface IGameRow {
  row: GameRow
}
interface IGameMap {
  map: GameMap
}
interface ITank {
  location: Location
  type: TankType
}

interface IGame {
  map: GameMap
  isInited: boolean
  userTanks: ITank[]
  enemyTanks: ITank[]
}

type TankType =
  | GameItemType['user1']
  | GameItemType['user2']
  | GameItemType['enemyTank']
type KeyboardMoveEvent = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
type MapSize = [col: number, row: number]
type Location = [x: number, y: number]

export { GameItemEnum }
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
  KeyboardMoveEvent,
  TankType,
}
