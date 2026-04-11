import { useState } from "react";
import { login, signup } from "../firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const getErrorMessage = (err) => {
    const code = err.code || "";

    if (code === "auth/user-not-found") {
      return "No account found with this email";
    }

    if (code === "auth/wrong-password") {
      return "Incorrect password";
    }

    if (code === "auth/email-already-in-use") {
      return "Email already registered";
    }

    if (code === "auth/invalid-email") {
      return "Invalid email format";
    }

    if (code === "auth/weak-password") {
      return "Password should be at least 6 characters";
    }
    
    if (code === "auth/invalid-credential") {
      return "Invalid email or password";
    }

    return "Something went wrong. Try again.";
  };

  const handleSubmit = async () => {
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      console.log(err);
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 gap-3">
      <h2 className="text-xl font-semibold">
        {isLogin ? "Login" : "Signup"}
      </h2>

      <input
        placeholder="Email"
        className="border p-2 w-64"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-64"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        className={`px-4 py-2 text-white ${isLogin ? "bg-blue-500" : "bg-green-500"
          }`}
      >
        {isLogin ? "Login" : "Signup"}
      </button>

      {/* Toggle */}
      <p
        className="text-sm text-blue-600 cursor-pointer"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Don't have an account? Signup"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}

export default Login;