import { getID } from "../sideEffect/getId";
import {
  ComplexLocation,
  DirectionEnum,
  DirectionValue,
  GameItemEnum,
  IBullet,
  Location,
} from "../type";

export const BulletLocationTypeEnum = {
  L: 1,
  R: 2,
  T: 3,
  D: 4,
} as const;

class Bullet implements IBullet {
  public readonly id = getID();
  public readonly type = GameItemEnum.bullet;
  public readonly complexLocations: ComplexLocation[];
  constructor(location: Location, public readonly direction: DirectionValue) {
    const [x, y] = location;
    this.complexLocations =
      direction === DirectionEnum.left || direction === DirectionEnum.right
        ? [
            {
              prevLocation: [x, y],
              location: [x, y],
              locationType: BulletLocationTypeEnum.T,
            },
            {
              prevLocation: [x, y + 1],
              location: [x, y + 1],
              locationType: BulletLocationTypeEnum.D,
            },
          ]
        : [
            {
              prevLocation: [x, y],
              location: [x, y],
              locationType: BulletLocationTypeEnum.L,
            },
            {
              prevLocation: [x + 1, y],
              location: [x + 1, y],
              locationType: BulletLocationTypeEnum.R,
            },
          ];
  }
}

export default Bullet;
