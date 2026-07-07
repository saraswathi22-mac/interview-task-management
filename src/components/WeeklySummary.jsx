import { getWeeklyStats, groupByKey } from "../helpers/weeklyStats";

const WeeklySummary = ({ tasks }) => {
  const stats = getWeeklyStats(tasks);

  const techStackStats = groupByKey(
    tasks,
    "techStack",
    (stack) => stack.charAt(0).toUpperCase() + stack.slice(1)
  );

  const difficultyStats = groupByKey(
    tasks,
    "difficulty",
    (level) => level.toLowerCase()
  );

  const completionPercent =
    stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);

  const topTech = Object.entries(techStackStats).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  const hardTasks = difficultyStats.hard || 0;

  const mediumTasks = difficultyStats.medium || 0;

  const easyTasks = difficultyStats.easy || 0;

  let insightMessage = "Good progress this week. Keep maintaining consistency.";

  if (completionPercent >= 85) {
    insightMessage =
      "Excellent consistency this week. You're building strong interview momentum.";
  } else if (completionPercent >= 60) {
    insightMessage =
      "Good effort this week. Completing a few more pending tasks can improve your preparation speed.";
  } else {
    insightMessage =
      "Your consistency dropped this week. Try focusing on smaller daily goals to regain momentum.";
  }

  if (topTech) {
    insightMessage += ` Your strongest focus area was ${topTech}.`;
  }

  if (hardTasks >= 3) {
    insightMessage += " Great job tackling hard problems consistently.";
  } else if (mediumTasks > easyTasks) {
    insightMessage +=
      " You're steadily progressing through medium-level challenges.";
  } else {
    insightMessage += " Try solving more medium and hard problems next week.";
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} />

        <StatCard label="Done" value={stats.done} color="green" />

        <StatCard label="Pending" value={stats.todo} color="gray" />

        <StatCard label="🔥 Streak" value="5 Days" color="yellow" />
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Weekly Progress</p>

          <p className="text-lg font-bold text-blue-600">
            {completionPercent}%
          </p>
        </div>

        <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <div className="rounded-2xl border border-gray-100 p-5">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">
            🚀 Tech Stack Coverage
          </h4>

          {Object.keys(techStackStats).length ? (
            <ul className="space-y-2">
              {Object.entries(techStackStats).map(([stack, count]) => (
                <li
                  key={stack}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm"
                >
                  <span className="text-gray-700">{stack}</span>

                  <span className="font-semibold text-gray-900">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyText text="No tasks this week" />
          )}
        </div>

        {/* Difficulty */}
        <div className="rounded-2xl border border-gray-100 p-5">
          <h4 className="text-sm font-semibold text-gray-800 mb-4">
            🎯 Difficulty Distribution
          </h4>

          {Object.keys(difficultyStats).length ? (
            <ul className="space-y-2">
              {Object.entries(difficultyStats).map(([level, count]) => (
                <li
                  key={level}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm capitalize"
                >
                  <span className="text-gray-700">{level}</span>

                  <span className="font-semibold text-gray-900">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyText text="No data available" />
          )}
        </div>
      </div>

      {/* Weekly Insight */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          ⚡ Weekly Insight
        </h4>

        <p className="text-sm leading-6 text-blue-700">{insightMessage}</p>
      </div>
    </div>
  );
};

/* ---------- Small UI Helpers ---------- */

const StatCard = ({ label, value, color = "gray" }) => {
  const colorMap = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    gray: "text-gray-700",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <p className="text-xs font-medium text-gray-500">{label}</p>

      <p className={`mt-2 text-xl md:text-2xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
};

const EmptyText = ({ text }) => (
  <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-400">
    {text}
  </div>
);

export default WeeklySummary;
