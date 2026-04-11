import { configureStore } from "@reduxjs/toolkit";
import interviewTaskReducer from "../features/interviewTasks/interviewTaskSlice";
import { auth } from "../firebase/config";

// Load tasks from localStorage
const loadTasksFromLocalStorage = () => {
  try {
    const user = auth.currentUser;
    const key = user ? `interviewTasks_${user.uid}` : "interviewTasks_guest";

    const tasks = localStorage.getItem(key);
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
    const user = auth.currentUser;
    const key = user ? `interviewTasks_${user.uid}` : "interviewTasks_guest";

    const tasks = store.getState().interviewTasks;
    localStorage.setItem(key, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks to localStorage", error);
  }
});