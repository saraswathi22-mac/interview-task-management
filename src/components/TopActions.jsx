import { Link } from "react-router-dom";
import Button from "./Button";

const TopActions = ({
  isToday,
  hasUnfinishedYesterday,
  onRollover,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 🔷 Primary Action */}
      <Link to="/add-task">
        <Button>
          <span className="mr-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-indigo-600 text-sm font-bold">
            +
          </span>
          Add Task
        </Button>
      </Link>

      {/* 🔷 Secondary Action */}
      {isToday && hasUnfinishedYesterday && (
        <Button
          onClick={onRollover}
          variant="secondary"
        >
          ⏭ Roll over tasks
        </Button>
      )}

      {/* 🔷 Hint (optional UX touch) */}
      {isToday && hasUnfinishedYesterday && (
        <span className="text-xs text-gray-500">
          You have unfinished tasks from yesterday
        </span>
      )}
    </div>
  );
};

export default TopActions;