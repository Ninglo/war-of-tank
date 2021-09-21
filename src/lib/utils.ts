import _ from 'lodash'
import {
  GameItem,
  GameItemEnum,
  GameMap,
  IGame,
  IGameMap,
  KeyboardMoveEvent,
  Location,
  MapSize,
} from '../type'

type Range = (start: number, end: number) => number[]
export const range: Range = (start, end) => {
  const length = end - start
  return length > 0 ? [...Array(length).keys()].map((val) => val + start) : []
}

type CreateMatrix = <T>([col, row]: [number, number], val: T) => T[][]
export const createMatrix: CreateMatrix = ([col, row], val) => {
  return range(0, row).map(() => range(0, col).map(() => val))
}

type SetMap = (map: GameMap, itemType: GameItem, location: Location) => GameMap
export const setMap: SetMap = (map, itemType, [x, y]) => {
  const cloneMap = _.cloneDeep(map)
  cloneMap[y][x] = itemType

  return cloneMap
}

type MoveLocation = (
  event: KeyboardMoveEvent,
  location: Location,
  map: GameMap
) => Location
export const moveLocation: MoveLocation = (event, [x, y], gameMap) => {
  const canMove = canMapMove(gameMap)
  if (event === 'ArrowUp') {
    return canMove([x, y - 1]) ? [x, y - 1] : [x, y]
  } else if (event === 'ArrowDown') {
    return canMove([x, y + 1]) ? [x, y + 1] : [x, y]
  } else if (event === 'ArrowLeft') {
    return canMove([x - 1, y]) ? [x - 1, y] : [x, y]
  } else if (event === 'ArrowRight') {
    return canMove([x + 1, y]) ? [x + 1, y] : [x, y]
  } else {
    const never: never = event
    return never
  }
}

type CanMapMove = (gameMap: GameMap) => (location: Location) => boolean
const canMapMove: CanMapMove =
  (gameMap) =>
  ([x, y]) => {
    const [width, height] = getMapSize(gameMap)
    const matchWidth = x >= 0 && x < width
    const matchHeight = y >= 0 && y < height
    if (!(matchWidth && matchHeight)) {
      return false
    }

    const curtItem = gameMap[y][x]
    const isVoid = !curtItem

    return isVoid
  }

type GetMapSize = (gameMap: GameMap) => MapSize
export const getMapSize: GetMapSize = (gameMap) => {
  return [gameMap[0].length, gameMap.length]
}

type UpdateMap = (state: IGame) => IGame
export const updateMap: UpdateMap = (state) => {
  const mapWithUserTank = state.userTanks.reduce(
    (prevMap, tank) => setMap(prevMap, tank.type, tank.location),
    state.map
  )
  const mapWithUserAndEnemyTank = state.enemyTanks.reduce(
    (prevMap, tank) => setMap(prevMap, GameItemEnum.enemyTank, tank.location),
    mapWithUserTank
  )
  return {
    ...state,
    map: mapWithUserAndEnemyTank,
  }
}

type ChangeIthVal = <T>(arr: T[], item: T, i: number) => T[]
export const changeIthVal: ChangeIthVal = (arr, item, i) => {
  const newArr = _.cloneDeep(arr)
  newArr[i] = item
  return newArr
}
