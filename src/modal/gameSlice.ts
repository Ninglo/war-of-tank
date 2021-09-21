import createSlice from 'redux-prim'
import {
  changeIthVal,
  createMatrix,
  getMapSize,
  moveLocation,
  range,
  setMap,
  updateMap,
} from '../lib/utils'
import {
  GameItemEnum,
  IGame,
  IGameMap,
  MapSize,
  Location,
  KeyboardMoveEvent,
  TankType,
  ITank,
  GameMap,
} from '../type'

type PartialState = Partial<IGame>

type GameDefaultState = () => IGame
const getDefaultState: GameDefaultState = () => ({
  map: [[]],
  isInited: false,
  userTanks: [],
  enemyTanks: [],
})

export const { actions, selector, reducer } = createSlice(
  'game',
  getDefaultState,
  ({ initState, mergeState, setState }) => {
    return {
      createMap([col, row]: MapSize) {
        return setState((state) => {
          const map: GameMap = createMatrix([col, row], GameItemEnum.void)
          const curtState: IGame = {
            ...state,
            map: map,
            isInited: true,
          }
          curtState.map[3][3] = 3
          return curtState
        })
      },
      createTank(location: Location, type: TankType) {
        return setState((state) => {
          const tank: ITank = { location, type }
          const pickState:
            | Pick<IGame, 'userTanks'>
            | Pick<IGame, 'enemyTanks'> =
            type === GameItemEnum.user1 || type === GameItemEnum.user2
              ? {
                  userTanks: [...state.userTanks, tank],
                }
              : {
                  enemyTanks: [...state.enemyTanks, tank],
                }

          const curtState: IGame = {
            ...state,
            ...pickState,
            map: setMap(state.map, type, tank.location),
          }

          return updateMap(curtState)
        })
      },
      moveTank(tankType: TankType, event: KeyboardMoveEvent[]) {
        return setState((state) => {
          if (
            tankType === GameItemEnum.user1 ||
            tankType === GameItemEnum.user2
          ) {
            const updateTanksState = state.userTanks.reduce(
              (prevState, tank, i) => {
                if (tank.type !== tankType) {
                  return prevState
                }
                const curtMap = setMap(
                  prevState.map,
                  GameItemEnum.void,
                  tank.location
                )
                const curtUserTanks = changeIthVal(
                  prevState.userTanks,
                  {
                    location: moveLocation(
                      event[0],
                      prevState.userTanks[i].location,
                      curtMap
                    ),
                    type: tank.type,
                  },
                  i
                )
                return {
                  ...prevState,
                  map: curtMap,
                  userTanks: curtUserTanks,
                }
              },
              state
            )
            const updateMapState = updateMap(updateTanksState)

            return updateMapState
          } else {
            state.enemyTanks.reduce((prevState, tank, i) => {
              const enemyTanks = changeIthVal(
                prevState.enemyTanks,
                {
                  location: moveLocation(
                    event[i],
                    prevState.enemyTanks[i].location,
                    prevState.map
                  ),
                  type: tank.type,
                },
                i
              )
              const updateEnemyTankState: IGame = {
                ...state,
                enemyTanks,
              }

              return updateMap(updateEnemyTankState)
            }, state)
          }
        })
      },
    }
  }
)
