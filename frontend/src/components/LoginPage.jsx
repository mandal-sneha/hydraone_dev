import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const LoginPage = () => {
  const navigate = useNavigate();

  const [developerId, setDeveloperId] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!developerId || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/login", {
        developerId,
        password,
      });

      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("developerName", data.developer.name);
      localStorage.setItem("developerId", data.developer.id);

      
      navigate("/dashboard");
    } catch (err) {
      setShake(true);
      setError(
        err.response?.data?.message || "Invalid Developer ID or Password"
      );
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">

      <h1 className="text-3xl font-light tracking-widest text-slate-700 mb-8 uppercase">
        HYDRAONE
      </h1>

      <div
        className={`bg-white/70 backdrop-blur-md border border-white/60 rounded shadow-lg w-full max-w-md px-12 py-10 ${
          shake ? "animate-bounce" : ""
        }`}
      >
        
        <div className="mb-5">
          <label className="block text-xs font-light tracking-widest text-slate-400 uppercase mb-2">
            Developer ID
          </label>
          <input
            type="text"
            placeholder="Enter developer ID"
            value={developerId}
            onChange={(e) => {
              setDeveloperId(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-white/80 border border-blue-200 rounded-sm px-4 py-3 text-sm font-light text-slate-700 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        
        <div className="mb-6">
          <label className="block text-xs font-light tracking-widest text-slate-400 uppercase mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-white/80 border border-blue-200 rounded-sm px-4 py-3 text-sm font-light text-slate-700 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        
        {error && (
          <p className="text-red-400 text-xs text-center mb-4 tracking-wide">
            {error}
          </p>
        )}

        
        <button
          onClick={handleLogin}
          className="w-full bg-slate-700 hover:bg-slate-800 active:scale-95 text-white text-xs font-light tracking-widest uppercase py-3 rounded-sm transition"
        >
          Submit
        </button>

        <p className="text-center mt-5 text-xs tracking-widest text-slate-300 uppercase">
          Admin Access Only
        </p>

        <p className="text-center mt-4 text-xs font-light text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-slate-700 transition"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;