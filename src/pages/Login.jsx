import { useState } from "react";
import { login, signup } from "../firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // 👈 toggle state

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      alert(err.message);
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

      <button
        onClick={handleSubmit}
        className={`px-4 py-2 text-white ${
          isLogin ? "bg-blue-500" : "bg-green-500"
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