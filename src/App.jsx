import { Route, Routes } from "react-router-dom";
import AddInterviewTask from "./features/interviewTasks/AddInterviewTask";
import EditInterviewTask from "./features/interviewTasks/EditInterviewTask";
import InterviewTaskList from "./features/interviewTasks/InterviewTaskList";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Page Container */}
      <div className="container mx-auto max-w-5xl px-4 py-10 md:py-16">

        {/* App Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Interview Prep Planner
          </h1>

          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-xl mx-auto">
            Plan daily interview questions, track your progress, and improve
            your preparation with a simple task planner.
          </p>
        </header>

        {/* App Content Card */}
        <div className="bg-white shadow-md rounded-xl p-6 md:p-8">

          {/* Routes */}
          <Routes>
            <Route path="/" element={<InterviewTaskList />} />
            <Route path="/add-task" element={<AddInterviewTask />} />
            <Route path="/edit-task/:id" element={<EditInterviewTask />} />
          </Routes>

        </div>
      </div>
    </div>
  );
}

export default App;