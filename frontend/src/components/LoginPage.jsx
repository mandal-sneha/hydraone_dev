import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");

  const adminUser = "admin";
  const adminPass = "12345";

  const handleLogin = () => {
    if (username === adminUser && password === adminPass) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/generate-admin-key");
    } else {
      setShake(true);
      setError("Invalid Username or Password");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">

      {/* Brand */}
      <h1 className="text-3xl font-light tracking-widest text-slate-700 mb-8 uppercase">
        HYDRAONE
      </h1>

      {/* Card */}
      <div className={`bg-white/70 backdrop-blur-md border border-white/60 rounded shadow-lg w-full max-w-md px-12 py-10 ${shake ? "animate-bounce" : ""}`}>

        {/* Username */}
        <div className="mb-5">
          <label className="block text-xs font-light tracking-widest text-slate-400 uppercase mb-2">
            User name
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-white/80 border border-blue-200 rounded-sm px-4 py-3 text-sm font-light text-slate-700 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-xs font-light tracking-widest text-slate-400 uppercase mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-white/80 border border-blue-200 rounded-sm px-4 py-3 text-sm font-light text-slate-700 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-xs text-center mb-4 tracking-wide">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleLogin}
          className="w-full bg-slate-700 hover:bg-slate-800 active:scale-95 text-white text-xs font-light tracking-widest uppercase py-3 rounded-sm transition"
        >
          submit
        </button>

        {/* Admin label */}
        <p className="text-center mt-5 text-xs tracking-widest text-slate-300 uppercase">
          Admin Access Only
        </p>

        {/* Signup */}
        <p className="text-center mt-4 text-xs font-light text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:text-slate-700 transition">
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;