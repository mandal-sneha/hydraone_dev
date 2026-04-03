import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AdminLevelPage from "./AdminlevelPage";
import AdminKeysPage from "./AdminkeyList";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("generate");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("developerName");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">

      <aside className="w-64 shrink-0 flex flex-col bg-white/60 backdrop-blur-sm border-r border-white/50 shadow-sm overflow-hidden">

        <div className="px-8 py-6 border-b border-white/50">
          <span className="text-lg font-light tracking-widest text-slate-700 uppercase">
            HydraOne
          </span>
          <p className="text-[10px] tracking-widest text-slate-400 uppercase mt-0.5">
            Developer Console
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">

          <button
            onClick={() => setActivePage("generate")}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-light tracking-widest uppercase transition
              ${activePage === "generate"
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
              }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            Generate Key
          </button>

          <button
            onClick={() => setActivePage("list")}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-light tracking-widest uppercase transition
              ${activePage === "list"
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
              }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Admin Key List
          </button>

        </nav>

        <div className="px-4 py-5 border-t border-white/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-light tracking-widest uppercase text-slate-500 hover:bg-red-50 hover:text-red-400 transition"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Logout
          </button>
        </div>

      </aside>

      <div className="flex-1 min-w-0 overflow-auto">
        {activePage === "generate" ? (
          <AdminLevelPage embedded />
        ) : (
          <AdminKeysPage embedded />
        )}
      </div>

    </div>
  );
};

export default DashboardPage;