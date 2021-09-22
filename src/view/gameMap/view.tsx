import type { FC } from "react";
import { useSelector } from "react-redux";
import type { IGameItem, IGameRow } from "../../type";
import { selector } from "../../modal/gameSlice";

const GameItem = ({ type, direction }: IGameItem) => {
  direction && console.log(direction);
  return (
    <div
      className={`game-item game-item-${type} ${
        direction ? `game-item-direction-${direction}` : ""
      }`}
    >
      {}
      {type === 1 ? "user1" : type === 2 ? "user2" : type}
    </div>
  );
};

const GameRow = ({ row }: IGameRow) => {
  return (
    <div className="game-row">
      {row.map((item, i) => (
        <GameItem key={i} {...{ ...item }} />
      ))}
    </div>
  );
};

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
