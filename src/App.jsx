import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { observeAuthState } from "./firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "./firebase/config";

import { loadTasks, saveTasks } from "./firebase/taskStorage";

import { setTasks } from "./features/interviewTasks/interviewTaskSlice";

import AddInterviewTask from "./features/interviewTasks/AddInterviewTask";
import EditInterviewTask from "./features/interviewTasks/EditInterviewTask";
import InterviewTaskList from "./features/interviewTasks/InterviewTaskList";
import Login from "./pages/Login";

import { Toaster } from "sonner";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import prepFlowLogo from "../public/prep-flow.png";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.interviewTasks);

  // Observe Firebase auth state
  useEffect(() => {
    const unsubscribe = observeAuthState(async (currentUser) => {
      setUser(currentUser);

      const savedTasks = await loadTasks(currentUser);
      dispatch(setTasks(savedTasks));

      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Save tasks whenever tasks change
  useEffect(() => {
    if (loading) return;

    const saveData = async () => {
      await saveTasks(user, tasks);
    };

    saveData();
  }, [tasks, user, loading]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!user) {
    return <Login />;
  }

  const userName = (user.displayName || user.email?.split("@")[0] || "User")
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-blue-50">
        {/* Navbar */}
        <header className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            {/* Logo */}
            <div className="flex items-center gap-1">
              <img
                src={prepFlowLogo}
                alt="PrepFlow"
                className="h-11 w-10 object-contain"
              />

              <h1 className="text-2xl font-bold tracking-tight text-gray-800">
                PrepFlow
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center">
              {/* Profile Button */}
              <button
                type="button"
                onClick={handleMenuOpen}
                className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-gray-100"
              >
                {/* Avatar */}
                <div
                  className="
flex h-10 w-10 items-center justify-center
rounded-full
bg-green-600
text-white
font-semibold
shadow-sm
"
                >
                  {userName.charAt(0).toUpperCase()}
                </div>

                {/* User Name */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {userName}
                  </p>
                </div>

                <KeyboardArrowDownIcon
                  fontSize="small"
                  className={`transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Menu */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1,
                    minWidth: 220,
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}
                >
                  <ListItemIcon>
                    <LogoutOutlinedIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-5xl px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <Routes>
              <Route path="/" element={<InterviewTaskList />} />
              <Route path="/add-task" element={<AddInterviewTask />} />
              <Route path="/edit-task/:id" element={<EditInterviewTask />} />
            </Routes>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
