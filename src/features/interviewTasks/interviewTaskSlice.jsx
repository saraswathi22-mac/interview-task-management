import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const interviewTaskSlice = createSlice({
  name: "interviewTasks",

  initialState,

  reducers: {

    // Load all tasks from localStorage
    setTasks: (state, action) => {
      return action.payload;
    },

    // Add task
    addInterviewTask: (state, action) => {
      state.push(action.payload);
    },

    // Edit task
    editInterviewTask: (state, action) => {

      const { id, updates } = action.payload;

      const task = state.find(
        (t) => t.id === id
      );

      if (task) {
        Object.assign(task, updates, {
          updatedAt: new Date().toISOString(),
        });
      }
    },

    // Delete task
    deleteInterviewTask: (state, action) => {

      return state.filter(
        (t) => t.id !== action.payload.id
      );
    },
  },
});

export const {
  setTasks,
  addInterviewTask,
  editInterviewTask,
  deleteInterviewTask,
} = interviewTaskSlice.actions;

export default interviewTaskSlice.reducer;