import type { InterviewTask } from "../types/task";

export const getWeeklyStats = (tasks: InterviewTask[] = []) => {
  return tasks.reduce(
    (acc, task) => {
      acc.total++;

      if (task.status === "done") acc.done++;
      else if (task.status === "skipped") acc.skipped++;
      else acc.todo++;

      return acc;
    },
    { total: 0, done: 0, skipped: 0, todo: 0 },
  );
};

export const groupByKey = (
  tasks: InterviewTask[] = [],
  key: keyof InterviewTask,
  formatter = (value: unknown) => String(value),
) => {
  return tasks.reduce(
    (acc, task) => {
      const value = task[key];

      if (!value) return acc;

      const formattedValue = formatter(value);

      acc[formattedValue] = (acc[formattedValue] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );
};

export const getDailyActivity = (tasks: InterviewTask[] = []) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const activity = days.map((day) => ({
    day,
    tasks: 0,
  }));

  tasks.forEach((task) => {
    const date = new Date(task.date);
    const jsDay = date.getDay(); // 0 = Sun

    const index = jsDay === 0 ? 6 : jsDay - 1;

    if (activity[index]) {
      activity[index].tasks++;
    }
  });

  return activity;
};
