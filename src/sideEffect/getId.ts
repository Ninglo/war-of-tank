let count = 0;

type GetID = () => number;
export const getID: GetID = () => count++;
