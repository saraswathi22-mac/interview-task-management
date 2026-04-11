import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import { addInterviewTask } from "./interviewTaskSlice";
import { getLocalDate, getWeekId } from "../../helpers/dateHelpers";
import { auth } from "../../firebase/config";

const AddInterviewTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const today = getLocalDate();
  const user = auth.currentUser;

  const [values, setValues] = useState({
    question: "",
    techStack: "React",
    priority: "medium",
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
        priority: values.priority,
        status: "todo",
        isRolledOver: false,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );

    navigate("/");
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-xl">

        {/* 🔷 Card */}
        <div className="bg-white shadow-sm border rounded-xl p-6 space-y-6 hover:shadow-md transition">

          {/* 🔷 Header */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Add Interview Task
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add one clear interview-style question for today.
            </p>
          </div>

          {/* 🔷 Question */}
          <TextField
            label="Interview Question"
            value={values.question}
            onChange={(e) =>
              setValues({ ...values, question: e.target.value })
            }
            inputProps={{
              placeholder: "Explain useEffect cleanup with an example",
            }}
            helperText="Keep it concise and interview-focused"
          />

          {/* 🔷 Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Tech Stack */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Tech Stack
              </label>
              <select
                value={values.techStack}
                onChange={(e) =>
                  setValues({ ...values, techStack: e.target.value })
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white text-gray-800 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="React">React</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="HTML/CSS">HTML / CSS</option>
                <option value="Frontend System Design">
                  Frontend System Design
                </option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                value={values.priority}
                onChange={(e) =>
                  setValues({ ...values, priority: e.target.value })
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white text-gray-800 capitalize transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="low">Low 🟢</option>
                <option value="medium">Medium 🟡</option>
                <option value="high">High 🔴</option>
              </select>
            </div>
          </div>

          {/* 🔷 Actions */}
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