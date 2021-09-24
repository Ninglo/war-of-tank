import { List } from "immutable";
import { Location } from "../type";

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
