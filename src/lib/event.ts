import Bullet from "../class/bullet";
import { ITank, IBullet, DirectionEnum, Location } from "../type";

type GetBulletLocation = (tank: ITank) => IBullet;
export const getBulletLocation: GetBulletLocation = (tank) => {
  const { complexLocations, direction } = tank;
  const mapToMatrix = {
    [DirectionEnum.up]: [0, -1],
    [DirectionEnum.down]: [0, 2],
    [DirectionEnum.left]: [-1, 0],
    [DirectionEnum.right]: [2, 0],
  } as const;
  const matrix = mapToMatrix[direction];
  const basicLocation = complexLocations[0].location;
  const location: Location = [
    matrix[0] + basicLocation[0],
    matrix[1] + basicLocation[1],
  ];
  const bullet = new Bullet(location, direction);
  return bullet;
};
