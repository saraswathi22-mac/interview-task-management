import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button";
import TextField from "../../components/TextField";

import {
  TECH_STACK_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "../../constants/interviewTaskOptions";

const InterviewTaskForm = ({
  title,
  subtitle,
  initialValues,
  submitLabel,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const [values, setValues] = useState(initialValues);

  const isChanged = JSON.stringify(values) !== JSON.stringify(initialValues);

  const handleSubmit = () => {
    if (!values.question.trim()) return;

    onSubmit(values);
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-xl">
        <div className="bg-white border rounded-xl p-6 space-y-6 shadow-sm hover:shadow-md transition">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
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
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {TECH_STACK_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

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
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {DIFFICULTY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>

            <Button
              onClick={handleSubmit}
              disabled={
                !values.question.trim() ||
                (submitLabel.includes("Save") && !isChanged)
              }
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewTaskForm;
