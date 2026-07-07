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

export const groupByKey = (tasks = [], key, formatter = (value) => value) => {
  return tasks.reduce((acc, task) => {
    const value = task[key];

    if (!value) return acc;

    const formattedValue = formatter(value);

    acc[formattedValue] = (acc[formattedValue] || 0) + 1;

    return acc;
  }, {});
};