import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import mailReducer from "./mailSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  mail: mailReducer
});

const store = configureStore({
  reducer: rootReducer
});

export default store;
