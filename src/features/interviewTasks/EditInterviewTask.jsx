import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/Button";
import TextField from "../../components/TextField";

import { editInterviewTask } from "./interviewTaskSlice";
import { auth } from "../../firebase/config";
import { toast } from "sonner";

import {
  TECH_STACK_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "../../constants/interviewTaskOptions";
import InterviewTaskForm from "./InterviewTaskForm";

const EditInterviewTask = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = auth.currentUser;

  const allTasks = useSelector((state) => state.interviewTasks);

  const interviewTasks = useMemo(() => {
    if (!user) return [];

    return allTasks.filter((task) => task.userId === user.uid);
  }, [allTasks, user]);

  const existingTask = interviewTasks.find((t) => t.id === id);

  const [values, setValues] = useState({
    question: existingTask?.question || "",
    techStack: existingTask?.techStack || "React",
    difficulty: existingTask?.difficulty || "medium",
  });

  const isChanged =
    values.question !== existingTask?.question ||
    values.techStack !== existingTask?.techStack ||
    values.difficulty !== existingTask?.difficulty;

    const handleEditTask = (values) => {
      if (!existingTask) return;
    
      dispatch(
        editInterviewTask({
          id,
          updates: {
            question: values.question,
            techStack: values.techStack,
            difficulty: values.difficulty,
            updatedAt: new Date().toISOString(),
          },
        })
      );
    
      toast.success("Interview task updated");
    
      setTimeout(() => {
        navigate("/");
      }, 800);
    };

  return (
    <InterviewTaskForm
      title="Edit Interview Task"
      subtitle="Update your task details"
      submitLabel="💾 Save Changes"
      isEditMode
      initialValues={{
        question: existingTask?.question || "",
        techStack: existingTask?.techStack || "React",
        difficulty: existingTask?.difficulty || "medium",
      }}
      onSubmit={handleEditTask}
    />
  );
};

export default EditInterviewTask;