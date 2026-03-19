const DailyProgress = ({ completed = 0, total = 0 }) => {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  // 🎨 Dynamic color based on progress
  const getProgressColor = () => {
    if (percent === 100) return "bg-green-600";
    if (percent >= 60) return "bg-green-500";
    if (percent >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200">
      {/* 🔷 Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800 tracking-wide">
          Today's Progress
        </p>

        <span className="text-sm font-bold text-indigo-600">
          {percent}%
        </span>
      </div>

      {/* 🔷 Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`h-full rounded-full ${getProgressColor()} transition-all duration-500 ease-in-out`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* 🔷 Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          {completed} / {total} completed
        </span>

        {percent === 100 ? (
          <span className="text-green-600 font-medium">
            🎉 Completed!
          </span>
        ) : percent >= 60 ? (
          <span className="text-green-500 font-medium">
            💪 Keep going!
          </span>
        ) : percent > 0 ? (
          <span className="text-yellow-500 font-medium">
            ⚡ Getting there
          </span>
        ) : (
          <span className="text-gray-400">
            Start your tasks
          </span>
        )}
      </div>
    </div>
  );
};

export default DailyProgress;