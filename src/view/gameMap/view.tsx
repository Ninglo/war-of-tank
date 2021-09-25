import type { FC } from "react";
import { useSelector } from "react-redux";
import { IGameItem, IGameRow } from "../../type";
import { selector } from "../../modal/gameSlice";
import React from "react";

const GameItem = React.memo(({ type, direction }: IGameItem) => {
  const className = `game-item game-item-${type} ${
    direction ? `game-item-direction-${direction}` : ""
  }`;
  return <div className={className}></div>;
});

const GameRow = React.memo(({ row }: IGameRow) => {
  return (
    <div className="game-row">
      {row.map((item, i) => (
        <GameItem key={i} {...{ ...item }} />
      ))}
    </div>
  );
});

export const GameMap: FC = () => {
  const gameState = useSelector(selector);
  const { map } = gameState;

  return (
    <div className="game-map">
      {map.map((row, i) => (
        <GameRow key={i} row={row} />
      ))}
    </div>
  );
};

export default GameMap;
