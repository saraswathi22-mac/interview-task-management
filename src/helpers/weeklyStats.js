export const getWeeklyStats = (tasks = []) => {
  return tasks.reduce(
    (acc, task) => {
      acc.total++;

      if (task.status === "done") acc.done++;
      else if (task.status === "skipped") acc.skipped++;
      else acc.todo++;

      return acc;
    },
    { total: 0, done: 0, skipped: 0, todo: 0 }
  );
};

export const groupByKey = (tasks = [], key) => {
  return tasks.reduce((acc, task) => {
    const value = task[key] ?? "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};