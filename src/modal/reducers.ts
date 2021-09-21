import { combineReducers } from "redux";
import { reducer as gameReducer } from "./gameSlice";

export default combineReducers({
  ...gameReducer,
});
