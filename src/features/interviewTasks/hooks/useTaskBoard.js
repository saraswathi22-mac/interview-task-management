import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { editInterviewTask } from "../interviewTaskSlice";
import { toast } from "sonner";

const useTaskBoard = ({ filteredTasks, dispatch }) => {
  const [boardTasks, setBoardTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  useEffect(() => {
    setBoardTasks({
      todo: filteredTasks.filter((t) => t.status === "todo"),
      inProgress: filteredTasks.filter(
        (t) => t.status === "inProgress"
      ),
      done: filteredTasks.filter((t) => t.status === "done"),
    });
  }, [filteredTasks]);

  const updateStatus = (id, status) => {
    dispatch(
      editInterviewTask({
        id,
        updates: { status },
      })
    );

    if (status === "done") {
      toast.success("🎉 Task completed");
    } else if (status === "inProgress") {
      toast.success("🚀 Task moved to In Progress");
    } else {
      toast.success("↩️ Task moved to To Do");
    }
  };

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

      if (column === overId) {
        targetColumn = column;
      }

      const hasOverTask = boardTasks[column].find(
        (task) => task.id === overId
      );

      if (hasOverTask) {
        targetColumn = column;
      }
    }

    if (!sourceColumn || !targetColumn) return;

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
        [sourceColumn]: arrayMove(
          prev[sourceColumn],
          oldIndex,
          newIndex
        ),
      }));

      return;
    }

    const sourceTasks = [...boardTasks[sourceColumn]];
    const targetTasks = [...boardTasks[targetColumn]];

    const activeTask = sourceTasks.find(
      (task) => task.id === activeId
    );

    if (!activeTask) return;

    const filteredSourceTasks = sourceTasks.filter(
      (task) => task.id !== activeId
    );

    const updatedTask = {
      ...activeTask,
      status: targetColumn,
    };

    targetTasks.push(updatedTask);

    setBoardTasks((prev) => ({
      ...prev,
      [sourceColumn]: filteredSourceTasks,
      [targetColumn]: targetTasks,
    }));

    dispatch(
      editInterviewTask({
        id: activeId,
        updates: {
          status: targetColumn,
        },
      })
    );

    if (targetColumn === "done") {
      toast.success("🎉 Task completed");
    } else if (targetColumn === "inProgress") {
      toast.success("🚀 Task moved to In Progress");
    } else {
      toast.success("↩️ Task moved to To Do");
    }
  };

  return {
    boardTasks,
    handleDragEnd,
    updateStatus,
  };
};

export default useTaskBoard;