import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, selector } from "../modal/gameSlice";
import { DirectionEnum, GameItemEnum } from "../type";
import ControlPanal from "./controlPanal/view";
import { GameMap } from "./gameMap/view";
import "./index.scss";
import { ONE_SECOND } from "../const/time";
import _ from "lodash";

const EventMap = {
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
  const gameState = useSelector(selector);
  const { userTanks } = gameState;

  useEffect(() => {
    const eventHandler = _.throttle((event: KeyboardEvent) => {
      if (
        (event.key === "ArrowUp" ||
          event.key === "ArrowDown" ||
          event.key === "ArrowLeft" ||
          event.key === "ArrowRight") &&
        userTanks.size > 0
      ) {
        dispatch(actions.moveTank(GameItemEnum.user1, EventMap[event.key], -1));
      }
      console.log(1);
    }, 10 * ONE_SECOND);
    document.addEventListener("keydown", eventHandler);
    return () => document.removeEventListener("keypress", eventHandler);
  }, [dispatch, userTanks.size]);

  useEffect(() => {
    const eventHandler = _.throttle((event: KeyboardEvent) => {
      if (
        (event.key === "w" ||
          event.key === "s" ||
          event.key === "a" ||
          event.key === "d") &&
        userTanks.size > 1
      ) {
        dispatch(actions.moveTank(GameItemEnum.user2, EventMap[event.key], -1));
      }
    }, 10 * ONE_SECOND);
    document.addEventListener("keypress", eventHandler);
    return () => document.removeEventListener("keypress", eventHandler);
  }, [dispatch, userTanks.size]);

  useEffect(() => {
    const eventHandler = _.throttle((event: KeyboardEvent) => {
      if (event.key === "j" && userTanks.size > 0) {
        dispatch(actions.createBullet());
      }
    }, 1 * ONE_SECOND);
    document.addEventListener("keypress", eventHandler);
    return () => document.removeEventListener("keypress", eventHandler);
  }, [dispatch, userTanks.size]);

  useEffect(() => {
    const eventHandler = () => dispatch(actions.moveBullets());
    const id = setInterval(eventHandler, 30 * ONE_SECOND);
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <div className="App">
      <GameMap />
      <ControlPanal />
    </div>
  );
};

export default App;
