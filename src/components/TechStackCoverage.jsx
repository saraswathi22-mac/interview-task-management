import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const TECH_COLORS = {
  React: "#3B82F6",
  JavaScript: "#F59E0B",
  TypeScript: "#3178C6",
  HTML: "#E34F26",
  CSS: "#1572B6",
  Redux: "#764ABC",
  Nextjs: "#111827",
};

function TechStackCoverage({ techStackStats }) {
  const techStack = Object.entries(techStackStats).map(([name, value]) => ({
    name,
    value,
  }));

  const total = techStack.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-2xl border border-gray-100 p-5">
      <h4 className="mb-4 text-sm font-semibold text-gray-800">
        🚀 Tech Stack Coverage
      </h4>

      {techStack.length ? (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={techStack}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {techStack.map((item) => (
                    <Cell
                      key={item.name}
                      fill={TECH_COLORS[item.name] ?? "#94A3B8"}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    `${value} task${value > 1 ? "s" : ""}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {techStack.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: TECH_COLORS[item.name] ?? "#94A3B8",
                    }}
                  />

                  <span className="text-gray-700">
                    {item.name} ({Math.round((item.value / total) * 100)}%)
                  </span>
                </div>

                <span className="font-semibold text-gray-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-400">
          No tasks this week
        </div>
      )}
    </div>
  );
}

export default TechStackCoverage;
