import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { observeAuthState } from "./firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "./firebase/config";

import AddInterviewTask from "./features/interviewTasks/AddInterviewTask";
import EditInterviewTask from "./features/interviewTasks/EditInterviewTask";
import InterviewTaskList from "./features/interviewTasks/InterviewTaskList";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observeAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading)
    return <p className="text-center mt-10">Loading...</p>;

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto max-w-5xl px-4 py-10 md:py-16">

        {/* Header */}
        <header className="mb-6 flex flex-col items-center gap-3 text-center">

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Interview Prep Planner
          </h1>

          <p className="text-sm md:text-base text-gray-600 max-w-xl">
            Plan daily interview questions, track your progress, and improve
            your preparation with a simple task planner.
          </p>

          {/* User + Logout */}
          <div className="flex items-center gap-4 mt-2">

            {/* Styled Logout Button */}
            <button
              onClick={handleLogout}
              className="
                flex items-center gap-2
                px-4 py-2
                bg-white border border-red-400
                text-red-500 text-sm font-medium
                rounded-lg
                hover:bg-red-50 hover:border-red-500
                transition-all duration-200
              "
            >
              <span>🚪</span>
              Logout
            </button>

          </div>
        </header>

        {/* Main Card */}
        <div className="bg-white shadow-md rounded-xl p-6 md:p-8">

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