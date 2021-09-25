import { getID } from "../sideEffect/getId";
import {
  ComplexLocation,
  DirectionValue,
  ITank,
  Location,
  TankType,
} from "../type";

export const TankLocationTypeEnum = {
  LT: 1,
  RT: 2,
  LD: 3,
  RD: 4,
} as const;

class Tank implements ITank {
  public readonly complexLocations: ComplexLocation[];
  public readonly id = getID();
  constructor(
    location: Location,
    public readonly type: TankType,
    public readonly direction: DirectionValue
  ) {
    const [x, y] = location;
    this.complexLocations = [
      {
        prevLocation: [x, y],
        location: [x, y],
        locationType: TankLocationTypeEnum.LT,
      },
      {
        prevLocation: [x + 1, y],
        location: [x + 1, y],
        locationType: TankLocationTypeEnum.RT,
      },
      {
        prevLocation: [x, y + 1],
        location: [x, y + 1],
        locationType: TankLocationTypeEnum.LD,
      },
      {
        prevLocation: [x + 1, y + 1],
        location: [x + 1, y + 1],
        locationType: TankLocationTypeEnum.RD,
      },
    ];
  }
}

export default Tank;
