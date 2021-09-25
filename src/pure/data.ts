import { List } from "immutable";
import { GameItemEnum, IGame, IMoveItem, Location } from "../type";

type ChangeIthVal = <T>(list: List<T>, item: T, i: number) => List<T>;
export const changeIthVal: ChangeIthVal = (list, item, i) => {
  return list.set(i, item);
};

type RemoveKthVal = <T>(list: List<T>, i: number) => List<T>;
export const removeKthVal: RemoveKthVal = (list, k) => {
  return list.remove(k);
};

type GetMatrixItem = <T>(matrix: List<List<T>>, location: Location) => T;
export const getMatrixItem: GetMatrixItem = (matrix, [x, y]) => {
  return matrix.get(y)!.get(x)!;
};

type IsSame = <T>(item: T) => (other: T) => boolean;
export const isSame: IsSame = (item) => (other) => item === other;

type ClearItem = <T extends IMoveItem>(state: IGame, item: T) => IGame;
export const clearItem: ClearItem = (state, item) => {
  if (item.type === GameItemEnum.bullet) {
    const curtBullets = state.bullets.filter((bullet) => item.id !== bullet.id);
    return { ...state, bullets: curtBullets };
  } else if (item.type === GameItemEnum.enemyTank) {
    const curtEnemyTanks = state.enemyTanks.filter(
      (tank) => item.id !== tank.id
    );
    return { ...state, enemyTanks: curtEnemyTanks };
  } else if (
    item.type === GameItemEnum.user1 ||
    item.type === GameItemEnum.user2
  ) {
    const curtUserTanks = state.userTanks.filter((tank) => item.id !== tank.id);
    return { ...state, userTanks: curtUserTanks };
  } else {
    const never = item.type;
    return never;
  }
};
