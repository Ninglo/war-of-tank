import { List } from "immutable";
import { MapSize, Matrix, DirectionEnum, Location } from "../type";

type Range = (start: number, end: number) => List<number>;
export const range: Range = (start, end) => {
  const length = end - start;
  return List([...Array(length).keys()].map((val) => val + start));
};

type CreateMatrix = <T>([col, row]: MapSize, val: T) => Matrix<T>;
export const createMatrix: CreateMatrix = ([col, row], val) => {
  return range(0, row).map(() => range(0, col).map(() => val));
};

export const matrixMethods = {
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
