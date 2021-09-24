import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, selector } from "../modal/gameSlice";
import { DirectionEnum, GameItemEnum } from "../type";
import ControlPanal from "./controlPanal/view";
import { GameMap } from "./gameMap/view";
import "./index.scss";
import { ONE_SECOND } from "../const/time";
import _ from "lodash";
import { getBulletLocation } from "../lib/utils";

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
  const gameState = useSelector(selector);
  const { userTanks } = gameState;

  useEffect(() => {
    document.addEventListener(
      "keydown",
      _.throttle((event: KeyboardEvent) => {
        if (
          event.key === "ArrowUp" ||
          event.key === "ArrowDown" ||
          event.key === "ArrowLeft" ||
          event.key === "ArrowRight"
        ) {
          dispatch(
            actions.moveTank(GameItemEnum.user1, MapEvent[event.key], -1)
          );
        }
      }, ONE_SECOND)
    );
  }, [dispatch]);

  useEffect(() => {
    document.addEventListener(
      "keypress",
      _.throttle((event: KeyboardEvent) => {
        if (
          event.key === "w" ||
          event.key === "s" ||
          event.key === "a" ||
          event.key === "d"
        ) {
          dispatch(
            actions.moveTank(GameItemEnum.user2, MapEvent[event.key], -1)
          );
        }
      }, ONE_SECOND)
    );
  }, [dispatch]);

  useEffect(() => {
    console.log(233);
    const eventHandler = _.throttle((event: KeyboardEvent) => {
      if (event.key === "j" && userTanks.length > 0) {
        dispatch(actions.createBullet());
      }
      console.log(1);
    }, 12 * ONE_SECOND);
    document.addEventListener("keypress", eventHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userTanks.length]);

  return (
    <div className="App">
      <GameMap />
      <ControlPanal />
    </div>
  );
};

export default App;
