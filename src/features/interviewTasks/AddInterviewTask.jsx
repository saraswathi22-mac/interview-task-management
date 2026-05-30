import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Button from "../../components/Button";
import TextField from "../../components/TextField";

import { addInterviewTask } from "./interviewTaskSlice";
import { getLocalDate, getWeekId } from "../../helpers/dateHelpers";
import { auth } from "../../firebase/config";
import { toast } from "sonner";

import {
  TECH_STACK_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "../../constants/interviewTaskOptions";

const AddInterviewTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const today = getLocalDate();
  const user = auth.currentUser;

  const [values, setValues] = useState({
    question: "",
    techStack: "React",
    difficulty: "medium",
  });

  const handleAddTask = () => {
    if (!values.question.trim()) return;

    if (!user) {
      alert("Please login first");
      return;
    }

    dispatch(
      addInterviewTask({
        id: uuidv4(),
        date: today,
        weekId: getWeekId(today),
        question: values.question,
        techStack: values.techStack,
        difficulty: values.difficulty,
        status: "todo",
        isRolledOver: false,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );

    toast.success("Interview task added");

    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-xl">
        <div className="bg-white shadow-sm border rounded-xl p-6 space-y-6 hover:shadow-md transition">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Add Interview Task
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Add one clear interview-style question for today.
            </p>
          </div>

          <TextField
            label="Interview Question"
            value={values.question}
            onChange={(e) =>
              setValues({
                ...values,
                question: e.target.value,
              })
            }
            inputProps={{
              placeholder: "Explain useEffect cleanup with an example",
            }}
            helperText="Keep it concise and interview-focused"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tech Stack */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Tech Stack
              </label>

              <select
                value={values.techStack}
                onChange={(e) =>
                  setValues({
                    ...values,
                    techStack: e.target.value,
                  })
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white text-gray-800 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {TECH_STACK_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Difficulty
              </label>

              <select
                value={values.difficulty}
                onChange={(e) =>
                  setValues({
                    ...values,
                    difficulty: e.target.value,
                  })
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white text-gray-800 capitalize transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {DIFFICULTY_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-600 hover:text-gray-800 transition"
            >
              Cancel
            </button>

            <Button
              onClick={handleAddTask}
              disabled={!values.question.trim()}
            >
              <span className="mr-1 font-bold">+</span>
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInterviewTask;
