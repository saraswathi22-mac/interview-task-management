import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState, useEffect } from "react";

import { DndContext, closestCorners } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

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
import BoardColumn from "../../components/BoardColumn";
import { deleteTaskFromFirebase } from "../../firebase/taskStorage";

import { motion } from "framer-motion";

import { toast } from "sonner";

const InterviewTaskList = () => {
  const dispatch = useDispatch();

  const user = auth.currentUser;

  const allTasks = useSelector((state) => state.interviewTasks);

  const interviewTasks = useMemo(() => {
    if (!user) return [];

    return allTasks.filter((task) => task.userId === user.uid);
  }, [allTasks, user]);

  const [selectedDate, setSelectedDate] = useState(getLocalDate());

  const [showWeeklySummary, setShowWeeklySummary] = useState(false);

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");

  // ✅ local board state
  const [boardTasks, setBoardTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

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

  const difficultyOrder = {
    high: 1,
    medium: 2,
    low: 3,
  };

  const filteredTasks = useMemo(() => {
    return interviewTasks
      .filter((t) => t.date === selectedDate)
      .filter((t) => {
        if (filter === "completed") return t.status === "done";

        if (filter === "pending") return t.status !== "done";

        return true;
      })
      .sort((a, b) => {
        const aDifficulty = a.difficulty || "medium";

        const bDifficulty = b.difficulty || "medium";

        return difficultyOrder[aDifficulty] - difficultyOrder[bDifficulty];
      });
  }, [interviewTasks, selectedDate, filter]);

  // ✅ sync board state
  useEffect(() => {
    setBoardTasks({
      todo: filteredTasks.filter((t) => t.status === "todo"),

      inProgress: filteredTasks.filter((t) => t.status === "inProgress"),

      done: filteredTasks.filter((t) => t.status === "done"),
    });
  }, [filteredTasks, interviewTasks]);

  const unfinishedYesterdayTasks = useMemo(
    () =>
      interviewTasks.filter((t) => t.date === yesterday && t.status === "todo"),
    [interviewTasks, yesterday]
  );

  const completedTasks = filteredTasks.filter(
    (t) => t.status === "done"
  ).length;

  const currentWeekId = getWeekId(today);

  const weeklyTasks = useMemo(
    () => interviewTasks.filter((t) => getWeekId(t.date) === currentWeekId),
    [interviewTasks, currentWeekId]
  );

  const updateStatus = (id, status) => {
    dispatch(
      editInterviewTask({
        id,
        updates: { status },
      })
    );
  };

  const handleDelete = async (id) => {
    try {
      // delete from firebase
      await deleteTaskFromFirebase(user, id);

      // delete from redux
      dispatch(deleteInterviewTask({ id }));

      toast.success("Interview task deleted");

    } catch (error) {
      console.error(error);

      toast.error("Failed to delete task");
    }
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

  // ✅ FULL DRAG LOGIC
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;

    const overId = over.id;

    let sourceColumn = null;

    let targetColumn = null;

    for (const column in boardTasks) {
      const hasActiveTask = boardTasks[column].find(
        (task) => task.id === activeId
      );

      if (hasActiveTask) {
        sourceColumn = column;
      }

      // dropped on column
      if (column === overId) {
        targetColumn = column;
      }

      // dropped on task
      const hasOverTask = boardTasks[column].find((task) => task.id === overId);

      if (hasOverTask) {
        targetColumn = column;
      }
    }

    if (!sourceColumn || !targetColumn) return;

    // ✅ same column reorder
    if (sourceColumn === targetColumn) {
      const oldIndex = boardTasks[sourceColumn].findIndex(
        (task) => task.id === activeId
      );

      const newIndex = boardTasks[targetColumn].findIndex(
        (task) => task.id === overId
      );

      if (oldIndex === newIndex) return;

      setBoardTasks((prev) => ({
        ...prev,

        [sourceColumn]: arrayMove(prev[sourceColumn], oldIndex, newIndex),
      }));

      return;
    }

    // ✅ move between columns
    const sourceTasks = [...boardTasks[sourceColumn]];

    const targetTasks = [...boardTasks[targetColumn]];

    const activeTask = sourceTasks.find((task) => task.id === activeId);

    if (!activeTask) return;

    // remove from source
    const filteredSourceTasks = sourceTasks.filter(
      (task) => task.id !== activeId
    );

    // update status
    const updatedTask = {
      ...activeTask,
      status: targetColumn,
    };

    // add to target
    targetTasks.push(updatedTask);

    // update local state
    setBoardTasks((prev) => ({
      ...prev,

      [sourceColumn]: filteredSourceTasks,

      [targetColumn]: targetTasks,
    }));

    // persist redux
    dispatch(
      editInterviewTask({
        id: activeId,
        updates: {
          status: targetColumn,
        },
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 space-y-10 max-w-6xl mx-auto px-4"
    >
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
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25 }}
          className="
    rounded-2xl
    border border-white/10
    bg-white/70
    backdrop-blur-xl
    shadow-[0_8px_30px_rgba(0,0,0,0.08)]
    p-5
  "
        >
          <DailyProgress
            completed={completedTasks}
            total={filteredTasks.length}
          />
        </motion.div>
      )}

      {/* Section Header */}
      <div className="border-b pb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          {isToday ? "Today's Interview Tasks" : `Tasks on ${selectedDate}`}
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
            className={`
  px-4 py-2 rounded-xl
  transition-all duration-300
  border border-white/10
  backdrop-blur-md
  shadow-sm
  hover:scale-[1.03]
  hover:shadow-lg
  ${
    filter === "all"
      ? "bg-blue-500 text-white"
      : "bg-white/60 text-gray-700 hover:bg-white"
  }
`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`
  px-4 py-2 rounded-xl
  transition-all duration-300
  border border-white/10
  backdrop-blur-md
  shadow-sm
  hover:scale-[1.03]
  hover:shadow-lg
  ${
    filter === "completed"
      ? "bg-blue-500 text-white"
      : "bg-white/60 text-gray-700 hover:bg-white"
  }
`}
          >
            Completed
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`
  px-4 py-2 rounded-xl
  transition-all duration-300
  border border-white/10
  backdrop-blur-md
  shadow-sm
  hover:scale-[1.03]
  hover:shadow-lg
  ${
    filter === "pending"
      ? "bg-blue-500 text-white"
      : "bg-white/60 text-gray-700 hover:bg-white"
  }
`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* ✅ Kanban Board */}
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["todo", "inProgress", "done"].map((status) => {
            const columnTasks = boardTasks[status];

            return (
              <BoardColumn
                key={status}
                id={status}
                title={
                  <div className="flex items-center gap-2">
                    <span>
                      {status === "todo"
                        ? "Todo"
                        : status === "inProgress"
                        ? "In Progress"
                        : "Done"}
                    </span>

                    <span
                      className={`
          text-xs
          px-2 py-0.5
          rounded-full
          font-medium

          ${
            status === "todo"
              ? "bg-gray-200 text-gray-700"
              : status === "inProgress"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-green-200 text-green-800"
          }
        `}
                    >
                      {columnTasks.length}
                    </span>
                  </div>
                }
                className={`
                  rounded-[28px]
                  p-5
                  min-h-[340px]
                  
                  backdrop-blur-2xl
                  
                  border border-white/30
                  
                  transition-all duration-500
                  
                  hover:-translate-y-2
                  hover:scale-[1.01]
                  
                  shadow-[0_10px_35px_rgba(0,0,0,0.08)]
                  
                  ${
                    status === "todo"
                      ? `
                        bg-gradient-to-br
                        from-slate-50
                        via-white
                        to-slate-100
                  
                        hover:shadow-slate-300/30
                      `
                      : status === "inProgress"
                      ? `
                        bg-gradient-to-br
                        from-yellow-50
                        via-orange-50
                        to-amber-100
                  
                        hover:shadow-yellow-300/30
                      `
                      : `
                        bg-gradient-to-br
                        from-emerald-50
                        via-green-50
                        to-teal-100
                  
                        hover:shadow-emerald-300/30
                      `
                  }
                  `}
              >
                <SortableContext
                  items={columnTasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-sm text-gray-400">Loading...</div>
                    ) : columnTasks.length ? (
                      columnTasks.map((task) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          key={task.id}
                        >
                          <TaskCard
                            task={task}
                            isPastDay={isPastDay}
                            onStatusChange={updateStatus}
                            onDelete={handleDelete}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400 text-center py-6">
                        No tasks
                      </div>
                    )}
                  </div>
                </SortableContext>
              </BoardColumn>
            );
          })}
        </div>
      </DndContext>

      {/* Weekly Summary */}
      <div className="pt-10 mt-10 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            📊 Weekly Analytics
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
          <div className="mt-5 rounded-3xl border border-gray-100 bg-white p-6 md:p-7 shadow-sm">
            <WeeklySummary tasks={weeklyTasks} weekId={currentWeekId} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InterviewTaskList;
