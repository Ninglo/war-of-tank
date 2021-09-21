import React, { FC, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selector, actions } from "../modal/gameSlice";
import { GameMap } from "./view";

const App: FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector(selector);
  const { isInited } = gameState;

  const addTank = useCallback(() => {
    dispatch(actions.createTank([0, 0]));
  }, [dispatch]);

  useEffect(() => {
    if (!isInited) {
      dispatch(actions.createMap([26, 18]));
    }
  }, [dispatch, isInited]);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      )
        dispatch(actions.moveTank(event.key as any));
    });
  }, [dispatch]);

  return (
    <div className="App">
      <GameMap />
      <button onClick={addTank}>Add tank!</button>
    </div>
  );
};

export default App;
