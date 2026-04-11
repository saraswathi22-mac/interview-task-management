import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState, useEffect } from "react";
import {
  addInterviewTask,
  editInterviewTask,
  deleteInterviewTask,
} from "./interviewTaskSlice";
import { auth } from "../../firebase/config";

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

  // 🔹 Get current user
  const user = auth.currentUser;

  // 🔹 Redux State
  const allTasks = useSelector((state) => state.interviewTasks);

  // ✅ Filter tasks by user
  const interviewTasks = useMemo(() => {
    if (!user) return [];
    return allTasks.filter((task) => task.userId === user.uid);
  }, [allTasks, user]);

  // 🔹 UI State
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [showWeeklySummary, setShowWeeklySummary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // 🔹 Date Helpers
  const today = getLocalDate();
  const yesterday = getYesterday();

  const isToday = selectedDate === today;
  const isPastDay = selectedDate < today;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [selectedDate]);

  // 🔹 Priority Order
  const priorityOrder = { high: 1, medium: 2, low: 3 };

  // 🔹 Derived Data
  const filteredTasks = useMemo(() => {
    return interviewTasks
      .filter((t) => t.date === selectedDate)
      .filter((t) => {
        if (filter === "completed") return t.status === "done";
        if (filter === "pending") return t.status !== "done";
        return true;
      })
      .sort((a, b) => {
        const aPriority = a.priority || "medium";
        const bPriority = b.priority || "medium";
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      });
  }, [interviewTasks, selectedDate, filter]);

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
    if (!unfinishedYesterdayTasks.length || !user) return;

    unfinishedYesterdayTasks.forEach((task) => {
      dispatch(
        addInterviewTask({
          ...task,
          userId: user.uid,
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

      {/* Header */}
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

      {/* Daily Progress */}
      {isToday && (
        <div className="bg-white rounded-xl shadow-sm p-4 border">
          <DailyProgress
            completed={completedTasks}
            total={filteredTasks.length}
          />
        </div>
      )}

      {/* Section Header */}
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

      {/* Filters */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Filter tasks</p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 border rounded ${
              filter === "all" ? "bg-blue-500 text-white" : ""
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 border rounded ${
              filter === "completed" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Completed
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 border rounded ${
              filter === "pending" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading tasks...
          </div>
        ) : filteredTasks.length ? (
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
          <div className="border border-dashed rounded-xl p-10 text-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-700">
              No tasks for this day
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {isToday
                ? "Start your interview prep by adding your first task 🚀"
                : "No tasks were planned for this date"}
            </p>
          </div>
        )}
      </div>

      {/* Weekly Summary */}
      <div className="pt-8 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Weekly Summary
            <span className="ml-2 text-sm text-gray-500">
              ({currentWeekId})
            </span>
          </h2>

          <button
            onClick={() => setShowWeeklySummary((prev) => !prev)}
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