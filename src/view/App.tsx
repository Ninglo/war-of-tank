import React, { FC, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selector, actions } from '../modal/gameSlice'
import { GameItemEnum } from '../type'
import { GameMap } from './view'

const MapEvent = {
  w: 'ArrowUp',
  s: 'ArrowDown',
  a: 'ArrowLeft',
  d: 'ArrowRight',
} as const

const App: FC = () => {
  const dispatch = useDispatch()
  const gameState = useSelector(selector)
  const { isInited, userTanks } = gameState
  const { length } = userTanks

  const addTank = useCallback(() => {
    dispatch(
      actions.createTank(
        [0, 0],
        length ? GameItemEnum.user2 : GameItemEnum.user1
      )
    )
  }, [dispatch, length])

  useEffect(() => {
    if (!isInited) {
      dispatch(actions.createMap([10, 10]))
    }
  }, [dispatch, isInited])

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight'
      )
        dispatch(actions.moveTank(GameItemEnum.user1, [event.key] as any))
    })
  }, [dispatch])

  useEffect(() => {
    document.addEventListener('keypress', (event) => {
      if (
        event.key === 'w' ||
        event.key === 's' ||
        event.key === 'a' ||
        event.key === 'd'
      )
        dispatch(
          actions.moveTank(GameItemEnum.user2, [
            MapEvent[event.key as 'w' | 's' | 'a' | 'd'],
          ])
        )
    })
  }, [dispatch])

  return (
    <div className="App">
      <GameMap />
      {length < 2 && <button onClick={addTank}>Add tank!</button>}
    </div>
  )
}

export default App
