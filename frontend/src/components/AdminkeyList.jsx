import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const PasswordModal = ({ onConfirm, onCancel }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    try {
      const developerId = localStorage.getItem("developerId");
      const res = await axiosInstance.post("/auth/login", {
        developerId,
        password,
      });
      if (res.data.success) onConfirm();
      else setError("Invalid credentials");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded w-full max-w-sm px-10 py-8">
        <h2 className="mb-4">Enter password</h2>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          className="w-full border px-3 py-2 mb-3"
        />
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <div className="flex gap-2">
          <button onClick={handleConfirm} className="flex-1 bg-black text-white py-2">Confirm</button>
          <button onClick={onCancel} className="flex-1 border py-2">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const LevelBadge = ({ level }) => {
  return <span className="text-xs uppercase">{level}</span>;
};

const AdminkeyList = ({ embedded = false }) => {
  const navigate = useNavigate();
  const developerName = localStorage.getItem("developerName") || "Developer";

  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [revealedKeys, setRevealedKeys] = useState({});

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/admin/get-all-admins", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          const flat = [];

          Object.entries(res.data.data).forEach(([state, stateData]) => {
            if (stateData.stateAdmin) {
              flat.push({
                id: `${state}-state`,
                adminName: stateData.stateAdmin.adminName,
                adminLevel: "state",
                state,
                district: "",
                municipality: "",
                key: stateData.stateAdmin.key,
              });
            }

            Object.entries(stateData.districts).forEach(([district, dData]) => {
              if (dData.districtAdmin) {
                flat.push({
                  id: `${state}-${district}-district`,
                  adminName: dData.districtAdmin.adminName,
                  adminLevel: "district",
                  state,
                  district,
                  municipality: "",
                  key: dData.districtAdmin.key,
                });
              }

              Object.entries(dData.municipalities).forEach(([municipality, mData]) => {
                flat.push({
                  id: `${state}-${district}-${municipality}`,
                  adminName: mData.municipalityAdmin.adminName,
                  adminLevel: "municipality",
                  state,
                  district,
                  municipality,
                  key: mData.municipalityAdmin.key,
                });
              });
            });
          });

          setRecords(flat);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAdmins();
  }, []);

  const filtered = records.filter((r) => {
    const matchesLevel = filterLevel === "all" || r.adminLevel === filterLevel;
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      !term ||
      r.adminName.toLowerCase().includes(term) ||
      r.state.toLowerCase().includes(term) ||
      r.district.toLowerCase().includes(term) ||
      r.municipality.toLowerCase().includes(term);

    return matchesLevel && matchesSearch;
  });

  const handleRevealClick = (id) => {
    if (revealedKeys[id]) {
      const next = { ...revealedKeys };
      delete next[id];
      setRevealedKeys(next);
      return;
    }
    setTargetId(id);
    setModalOpen(true);
  };

  const handleModalConfirm = () => {
    const record = records.find((r) => r.id === targetId);
    setRevealedKeys((prev) => ({ ...prev, [targetId]: record.key }));
    setModalOpen(false);
    setTargetId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("developerName");
    navigate("/");
  };

  const jurisdictionLabel = (r) => {
    if (r.adminLevel === "state") return r.state;
    if (r.adminLevel === "district") return `${r.district}, ${r.state}`;
    return `${r.municipality}, ${r.district}, ${r.state}`;
  };

  return (
    <div className={`flex flex-col ${embedded ? "min-h-full" : "min-h-screen"}`}>
      {!embedded && (
        <nav className="flex justify-between px-10 py-4 border-b">
          <span>HydraOne</span>
          <div className="flex gap-4">
            <span>Developer: {developerName}</span>
            <button onClick={() => navigate("/generate-admin-key")}>Generate Key</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      )}

      <div className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-4xl">

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border px-3 py-2"
            />
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="all">All</option>
              <option value="state">State</option>
              <option value="district">District</option>
              <option value="municipality">Municipality</option>
            </select>
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map((r) => (
              <div key={r.id} className="border p-4 flex justify-between items-center">
                <div>
                  <div className="flex gap-2">
                    <span>{r.adminName}</span>
                    <LevelBadge level={r.adminLevel} />
                  </div>
                  <p>{jurisdictionLabel(r)}</p>
                  <div>
                    {revealedKeys[r.id] ? revealedKeys[r.id] : "••••••••••••••••"}
                  </div>
                </div>
                <button onClick={() => handleRevealClick(r.id)}>
                  {revealedKeys[r.id] ? "Hide" : "Reveal"}
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>

      {modalOpen && (
        <PasswordModal
          onConfirm={handleModalConfirm}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminkeyList;