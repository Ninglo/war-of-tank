type Range = (start: number, end: number) => number[];
export const range: Range = (start, end) => {
  const length = end - start;
  return length > 0 ? [...Array(length).keys()].map((val) => val + start) : [];
};

type CreateMatrix = <T>([col, row]: [number, number], val: T) => T[][];
export const createMatrix: CreateMatrix = ([col, row], val) => {
  return range(0, row).map(() => range(0, col).map(() => val));
};
