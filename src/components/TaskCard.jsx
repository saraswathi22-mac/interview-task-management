import { Link } from "react-router-dom";

const TaskCard = ({ task, isPastDay, onStatusChange, onDelete }) => {
  const { techStack, status } = task;
  const priority = task.priority || "medium";

  const priorityColor = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  const statusColor = {
    done: "text-green-600",
    skipped: "text-yellow-600",
    todo: "text-gray-500",
    inProgress: "text-blue-600",
  };

  return (
    <div
      className={`group rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 border ${
        isPastDay
          ? "bg-gray-50 border-gray-200 opacity-70"
          : "bg-white border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      {/* 🔷 Header */}
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-indigo-600 transition">
          {task.question}
        </h3>

        {/* Priority badge */}
        <span
          className={`text-xs px-2 py-0.5 rounded-md font-medium capitalize ${
            priorityColor[priority] || "bg-gray-100 text-gray-600"
          }`}
        >
          {priority}
        </span>
      </div>

      {/* 🔷 Tech Stack */}
      <div className="flex items-center gap-2 text-xs">
        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium">
          {techStack}
        </span>

        <span className={`font-medium ${statusColor[status]}`}>
          ● {status}
        </span>
      </div>

      {/* 🔷 Extra Info */}
      <div className="text-xs space-y-1">
        {task.isRolledOver && (
          <p className="text-orange-500">
            ⏭ Rolled from yesterday
          </p>
        )}

        {isPastDay && (
          <p className="text-gray-400">
            🔒 Read-only
          </p>
        )}
      </div>

      {/* 🔷 Actions */}
      {!isPastDay && (
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex gap-2">
            {status === "todo" && (
              <button
                onClick={() => onStatusChange(task.id, "inProgress")}
                className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
              >
                ▶ Start
              </button>
            )}

            {status === "inProgress" && (
              <button
                onClick={() => onStatusChange(task.id, "done")}
                className="text-xs px-2 py-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition"
              >
                ✓ Done
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              to={`/edit-task/${task.id}`}
              className="text-xs px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition"
            >
              ✏
            </Link>

            <button
              onClick={() => onDelete(task.id)}
              className="text-xs px-2 py-1 rounded-md text-red-600 hover:bg-red-50 transition"
            >
              🗑
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;