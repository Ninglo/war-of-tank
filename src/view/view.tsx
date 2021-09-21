import React, { useEffect } from "react";
import type { FC } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import type { IGame, IGameItem, IGameMap, IGameRow } from "../type";
import { actions, selector } from "../modal/gameSlice";
import "./index.scss";

const GameItem = ({ name }: IGameItem) => {
  return <div className="game-item">{name}</div>;
};

const GameRow = ({ row }: IGameRow) => {
  return (
    <div className="game-row">
      {row.map((item, i) => (
        <GameItem key={i} {...item} />
      ))}
    </div>
  );
};

export const GameMap: FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector(selector);
  const { isInited, map } = gameState;

  useEffect(() => {
    if (!isInited) {
      dispatch(actions.createMap([3, 5]));
    }
  }, []);
  return (
    <div className="game-map">
      {map.map((row, i) => (
        <GameRow key={i} row={row} />
      ))}
    </div>
  );
};

export default GameMap;
