import { List, Map } from "immutable";

type EnumValue<T> = T[keyof T];
const DirectionEnum = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
} as const;
type Matrix<T = unknown> = List<List<T>>;
type DirectionType = keyof typeof DirectionEnum;
type DirectionValue = EnumValue<typeof DirectionEnum>;
const GameItemEnum = {
  void: "",
  user1: "user1",
  user2: "user2",
  enemyTank: "enemy",
  water: "water",
  bullet: "bullet",
  wall: "wall",
  iron: "iron",
} as const;
type GameItemType = typeof GameItemEnum;
type StaticItemType =
  | GameItemType["iron"]
  | GameItemType["void"]
  | GameItemType["wall"]
  | GameItemType["water"];
type MoveItemType = Exclude<EnumValue<GameItemType>, StaticItemType>;
type GameItem = {
  type: EnumValue<GameItemType>;
  direction?: DirectionValue;
  locationType?: number;
  id?: number;
};
type IGameItem = GameItem;
type GameRow = List<GameItem>;
type GameMap = List<GameRow>;
interface IGameRow {
  row: GameRow;
}
interface IGameMap {
  map: GameMap;
}
type ComplexLocation = {
  prevLocation: Location;
  location: Location;
  locationType: number;
};
type IBullet = IMoveItem<GameItemType["bullet"]>;
type ITank = IMoveItem<TankType>;
interface IMoveItem<T = MoveItemType> {
  complexLocations: ComplexLocation[];
  type: T;
  direction: DirectionValue;
  id: number;
}

interface IGame {
  map: GameMap;
  isInited: boolean;
  userTanks: Map<string | number, ITank>;
  enemyTanks: Map<string | number, ITank>;
  bullets: Map<string | number, IBullet>;
}

type TankType =
  | GameItemType["user1"]
  | GameItemType["user2"]
  | GameItemType["enemyTank"];
type MapSize = [col: number, row: number];
type Location = [x: number, y: number];

type SetStateMethod = (state: IGame) => IGame;

export { GameItemEnum, DirectionEnum };
export type {
  Matrix,
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
  IMoveItem,
  IBullet,
  ComplexLocation,
  StaticItemType,
  MoveItemType,
  SetStateMethod,
};
