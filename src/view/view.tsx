import React, { useEffect } from "react";
import type { FC } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import type { IGame, IGameItem, IGameMap, IGameRow } from "../type";
import { actions, selector } from "../modal/gameSlice";
import "./index.scss";
import { setMap } from "../lib/utils";

const GameItem = ({ name }: IGameItem) => {
  return <div className={`game-item game-item-${name}`}>{name}</div>;
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
type UpdateMap = (state: IGame) => IGameMap["map"];
const updateMap: UpdateMap = (state) => {
  return state.tanks.reduce(
    (prevMap, tank) => setMap(prevMap, tank, tank.location),
    state.map
  );
};
export const GameMap: FC = () => {
  const gameState = useSelector(selector);
  const renderMap = updateMap(gameState);

  return (
    <div className="game-map">
      {renderMap.map((row, i) => (
        <GameRow key={i} row={row} />
      ))}
    </div>
  );
};

export default GameMap;
