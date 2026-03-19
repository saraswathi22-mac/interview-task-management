// Get local date in YYYY-MM-DD format
export const getLocalDate = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

// Get yesterday's date in YYYY-MM-DD format
export const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
};

// Generate week ID (example: 2026-W12)
export const getWeekId = (dateStr) => {
  const date = new Date(dateStr);

  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDays = Math.floor(
    (date - firstDayOfYear) / (24 * 60 * 60 * 1000)
  );

  const week = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);

  return `${date.getFullYear()}-W${week}`;
};