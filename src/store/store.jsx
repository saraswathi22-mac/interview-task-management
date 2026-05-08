import { configureStore } from "@reduxjs/toolkit";
import interviewTaskReducer from "../features/interviewTasks/interviewTaskSlice";

export const store = configureStore({
  reducer: {
    interviewTasks: interviewTaskReducer,
  },
});