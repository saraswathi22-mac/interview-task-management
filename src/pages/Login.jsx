import { useState } from "react";
import { login, signup } from "../firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getErrorMessage = (err) => {
    const code = err.code || "";

    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email";

      case "auth/wrong-password":
        return "Incorrect password";

      case "auth/email-already-in-use":
        return "Email already registered";

      case "auth/invalid-email":
        return "Invalid email format";

      case "auth/weak-password":
        return "Password should be at least 6 characters";

      case "auth/invalid-credential":
        return "Invalid email or password";

      default:
        return "Something went wrong. Please try again.";
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const toggleMode = () => {
    setError("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700">
            Track • Practice • Improve
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
            Interview Prep Planner
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Master your preparation, one day at a time.
          </p>
        </div>

        {/* Form Title */}
        <h2 className="mb-6 text-center text-lg font-semibold text-slate-700">
          {isLogin ? "Sign in to continue" : "Create your account"}
        </h2>

        {/* Form */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition-all focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-slate-700 outline-none transition-all focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.01] hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </div>

        {/* Features */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
          <span>✓ Daily Tracking</span>
          <span>✓ Mock Interviews</span>
          <span>✓ Progress Insights</span>
        </div>

        {/* Toggle */}
        <div className="mt-8 text-center">
          <button
            onClick={toggleMode}
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;