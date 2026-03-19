import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import {
  addInterviewTask,
  editInterviewTask,
  deleteInterviewTask,
} from "./interviewTaskSlice";

// helpers
import {
  getLocalDate,
  getYesterday,
  getWeekId,
} from "../../helpers/dateHelpers";

// components
import DatePicker from "../../components/DatePicker";
import DailyProgress from "../../components/DailyProgress";
import TaskCard from "../../components/TaskCard";
import WeeklySummary from "../../components/WeeklySummary";
import TopActions from "../../components/TopActions";

const InterviewTaskList = () => {
  const dispatch = useDispatch();

  // 🔹 Redux State
  const interviewTasks = useSelector((state) => state.interviewTasks);

  // 🔹 UI State
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);

  // 🔹 Date Helpers
  const today = getLocalDate();
  const yesterday = getYesterday();

  const isToday = selectedDate === today;
  const isPastDay = selectedDate < today;

  // 🔹 Derived Data (Memoized 🚀)
  const filteredTasks = useMemo(
    () => interviewTasks.filter((t) => t.date === selectedDate),
    [interviewTasks, selectedDate]
  );

  const unfinishedYesterdayTasks = useMemo(
    () =>
      interviewTasks.filter(
        (t) => t.date === yesterday && t.status === "todo"
      ),
    [interviewTasks, yesterday]
  );

  const completedTasks = filteredTasks.filter(
    (t) => t.status === "done"
  ).length;

  const currentWeekId = getWeekId(today);

  const weeklyTasks = useMemo(
    () =>
      interviewTasks.filter(
        (t) => getWeekId(t.date) === currentWeekId
      ),
    [interviewTasks, currentWeekId]
  );

  // 🔹 Actions
  const updateStatus = (id, status) => {
    dispatch(editInterviewTask({ id, updates: { status } }));
  };

  const handleDelete = (id) => {
    dispatch(deleteInterviewTask({ id }));
  };

  const rolloverUnfinishedTasks = () => {
    if (!unfinishedYesterdayTasks.length) return;

    unfinishedYesterdayTasks.forEach((task) => {
      dispatch(
        addInterviewTask({
          ...task,
          id: crypto.randomUUID(),
          date: today,
          status: "todo",
          isRolledOver: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      );
    });
  };

  return (
    <div className="mt-6 space-y-10 max-w-4xl mx-auto px-4">
      {/* 🔷 Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TopActions
          isToday={isToday}
          hasUnfinishedYesterday={unfinishedYesterdayTasks.length > 0}
          onRollover={rolloverUnfinishedTasks}
        />

        <DatePicker
          selectedDate={selectedDate}
          max={today}
          onChange={setSelectedDate}
        />
      </div>

      {/* 🔷 Daily Progress */}
      {isToday && (
        <div className="bg-white rounded-xl shadow-sm p-4 border">
          <DailyProgress
            completed={completedTasks}
            total={filteredTasks.length}
          />
        </div>
      )}

      {/* 🔷 Section Header */}
      <div className="border-b pb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          {isToday
            ? "Today's Interview Tasks"
            : `Tasks on ${selectedDate}`}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isPastDay
            ? "Past days are read-only to maintain accurate progress"
            : "Stay consistent. Complete today's plan 🚀"}
        </p>
      </div>

      {/* 🔷 Task List */}
      <div className="grid gap-4">
        {filteredTasks.length ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isPastDay={isPastDay}
              onStatusChange={updateStatus}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="border border-dashed rounded-xl p-8 text-center bg-gray-50">
            <p className="text-gray-600 font-medium">
              No tasks for this date
            </p>
            {isToday && (
              <p className="text-sm text-gray-500 mt-2">
                Start by adding your first interview question ✨
              </p>
            )}
          </div>
        )}
      </div>

      {/* 🔷 Weekly Summary */}
      <div className="pt-8 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Weekly Summary
            <span className="ml-2 text-sm text-gray-500">
              ({currentWeekId})
            </span>
          </h2>

          <button
            onClick={() =>
              setShowWeeklySummary((prev) => !prev)
            }
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            {showWeeklySummary ? "Hide" : "View"}
          </button>
        </div>

        {showWeeklySummary && (
          <div className="mt-4 bg-white rounded-xl shadow-sm p-4 border">
            <WeeklySummary
              tasks={weeklyTasks}
              weekId={currentWeekId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewTaskList;