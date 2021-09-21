import React, { useEffect } from 'react'
import type { FC } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import type { IGame, IGameItem, IGameMap, IGameRow } from '../type'
import { actions, selector } from '../modal/gameSlice'
import './index.scss'
import { setMap } from '../lib/utils'

const GameItem = ({ name }: IGameItem) => {
  return (
    <div className={`game-item game-item-${name}`}>
      {name === 1 ? 'user1' : name === 2 ? 'user2' : name}
    </div>
  )
}

const GameRow = ({ row }: IGameRow) => {
  return (
    <div className="game-row">
      {row.map((item, i) => (
        <GameItem key={i} name={item} />
      ))}
    </div>
  )
}

export const GameMap: FC = () => {
  const gameState = useSelector(selector)
  const { map } = gameState

  return (
    <div className="game-map">
      {map.map((row, i) => (
        <GameRow key={i} row={row} />
      ))}
    </div>
  )
}

export default GameMap
