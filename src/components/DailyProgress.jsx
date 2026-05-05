const DailyProgress = ({ completed = 0, total = 0 }) => {
  const percent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const getProgressColor = () => {
    if (percent === 100)
      return "bg-gradient-to-r from-green-500 to-green-600";

    if (percent >= 60)
      return "bg-gradient-to-r from-green-400 to-green-500";

    if (percent >= 30)
      return "bg-gradient-to-r from-yellow-400 to-yellow-500";

    return "bg-gradient-to-r from-red-400 to-red-500";
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200">

      {/* 🔷 Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <p className="text-sm font-semibold text-gray-800">
            Today's Progress
          </p>
        </div>

        <span className="text-lg font-bold text-indigo-600">
          {percent}%
        </span>
      </div>

      {/* 🔷 Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden relative">

          {/* Fill */}
          <div
            className={`h-full rounded-full ${getProgressColor()} transition-all duration-500 ease-in-out`}
            style={{ width: `${percent}%` }}
          />

          {/* Subtle glow effect */}
          <div
            className="absolute top-0 left-0 h-full w-full opacity-10 bg-white"
          />
        </div>
      </div>

      {/* 🔷 Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium">
          {completed} / {total} completed
        </span>

        {percent === 100 ? (
          <span className="text-green-600 font-semibold">
            🎉 Completed!
          </span>
        ) : percent >= 60 ? (
          <span className="text-green-500 font-semibold">
            💪 Keep going!
          </span>
        ) : percent > 0 ? (
          <span className="text-yellow-500 font-semibold">
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