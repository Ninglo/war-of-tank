import {
  ComplexLocation,
  DirectionValue,
  GameItemEnum,
  IBullet,
  Location,
} from "../type";

export const BulletLocationTypeEnum = {
  L: 1,
  R: 2,
} as const;

class Bullet implements IBullet {
  public readonly type = GameItemEnum.bullet;
  public readonly complexLocations: ComplexLocation[];
  constructor(location: Location, public readonly direction: DirectionValue) {
    const [x, y] = location;
    this.complexLocations = [
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
