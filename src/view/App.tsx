import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions } from "../modal/gameSlice";
import { DirectionEnum, GameItemEnum } from "../type";
import ControlPanal from "./controlPanal/view";
import { GameMap } from "./gameMap/view";
import "./index.scss";

const MapEvent = {
  w: DirectionEnum.up,
  s: DirectionEnum.down,
  a: DirectionEnum.left,
  d: DirectionEnum.right,
  ArrowUp: DirectionEnum.up,
  ArrowDown: DirectionEnum.down,
  ArrowLeft: DirectionEnum.left,
  ArrowRight: DirectionEnum.right,
} as const;

const App: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      )
        dispatch(actions.moveTank(GameItemEnum.user1, [MapEvent[event.key]]));
    });
  }, [dispatch]);

  useEffect(() => {
    document.addEventListener("keypress", (event) => {
      if (
        event.key === "w" ||
        event.key === "s" ||
        event.key === "a" ||
        event.key === "d"
      )
        dispatch(actions.moveTank(GameItemEnum.user2, [MapEvent[event.key]]));
      console.log(event.key);
    });
  }, [dispatch]);

  return (
    <div className="App">
      <GameMap />
      <ControlPanal />
    </div>
  );
};

export default App;
