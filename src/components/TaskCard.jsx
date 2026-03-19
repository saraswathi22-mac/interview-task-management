import { Link } from "react-router-dom";

const TaskCard = ({ task, isPastDay, onStatusChange, onDelete }) => {
  const { techStack, difficulty, status } = task;

  // 🎨 Difficulty color
  const difficultyColor = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  };

  // 🎨 Status color
  const statusColor = {
    done: "text-green-600",
    skipped: "text-yellow-600",
    todo: "text-gray-700",
  };

  return (
    <div
      className={`group rounded-xl border p-4 flex justify-between gap-4 transition-all duration-200 ${
        isPastDay
          ? "bg-gray-50 border-gray-200 opacity-70"
          : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
      }`}
    >
      {/* 🔷 Task Info */}
      <div className="space-y-2">
        {/* Question */}
        <h3 className="font-medium text-gray-900 leading-snug group-hover:text-indigo-600 transition">
          {task.question}
        </h3>

        {/* Tech + Difficulty */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
            {techStack}
          </span>

          <span
            className={`px-2 py-0.5 rounded-md font-medium capitalize ${
              difficultyColor[difficulty] || "bg-gray-100 text-gray-600"
            }`}
          >
            {difficulty}
          </span>
        </div>

        {/* Status */}
        <p className="text-xs text-gray-500">
          Status:{" "}
          <span className={`font-semibold ${statusColor[status]}`}>
            {status}
          </span>
        </p>

        {/* Extra Info */}
        {task.isRolledOver && (
          <p className="text-xs text-orange-500">
            ⏭ Rolled over from yesterday
          </p>
        )}

        {isPastDay && (
          <p className="text-xs text-gray-400">
            🔒 Read-only (past day)
          </p>
        )}
      </div>

      {/* 🔷 Actions */}
      {!isPastDay && (
        <div className="flex flex-col items-end gap-2 text-xs font-medium">
          {status === "todo" && (
            <button
              onClick={() => onStatusChange(task.id, "done")}
              className="px-2 py-1 rounded-md text-green-600 hover:bg-green-50 transition"
            >
              ✓ Done
            </button>
          )}

          <Link
            to={`/edit-task/${task.id}`}
            className="px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition"
          >
            ✏ Edit
          </Link>

          <button
            onClick={() => onDelete(task.id)}
            className="px-2 py-1 rounded-md text-red-600 hover:bg-red-50 transition"
          >
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;