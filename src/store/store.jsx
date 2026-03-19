import { configureStore } from "@reduxjs/toolkit";
import interviewTaskReducer from "../features/interviewTasks/interviewTaskSlice";

// Load tasks from localStorage
const loadTasksFromLocalStorage = () => {
  try {
    const tasks = localStorage.getItem("interviewTasks");
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Failed to load tasks from localStorage", error);
    return [];
  }
};

export const store = configureStore({
  reducer: {
    interviewTasks: interviewTaskReducer,
  },
  preloadedState: {
    interviewTasks: loadTasksFromLocalStorage(),
  },
});

// Save tasks to localStorage whenever state changes
store.subscribe(() => {
  try {
    const tasks = store.getState().interviewTasks;
    localStorage.setItem("interviewTasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to localStorage", error);
  }
});