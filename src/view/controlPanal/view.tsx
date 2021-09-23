import { useCallback } from "react";
import type { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DirectionEnum, GameItemEnum } from "../../type";
import { actions, selector } from "../../modal/gameSlice";

const ControlPanal: FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector(selector);
  const { userTanks, isInited } = gameState;
  const { length } = userTanks;

  const addTank = useCallback(() => {
    dispatch(
      actions.createTank(
        [0, 0],
        length ? GameItemEnum.user2 : GameItemEnum.user1,
        DirectionEnum.up
      )
    );
  }, [dispatch, length]);

  const createMap = useCallback(() => {
    dispatch(actions.createMap([52, 36]));
  }, [dispatch]);

  return (
    <div>
      {!isInited && <button onClick={createMap}>Create Map!</button>}
      {isInited && length < 2 && <button onClick={addTank}>Add tank!</button>}
    </div>
  );
};

export default ControlPanal;
