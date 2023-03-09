import { combineReducers } from "redux";
import adminReducer from "./auth/adminAuth";
import userReducer from "./auth/auth";

const rootReducer = combineReducers({
  auth: userReducer,
  adminAuth: adminReducer,
});

export default rootReducer;
