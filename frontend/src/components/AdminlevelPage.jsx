import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import { LOCATION_DATA } from "../lib/locationData.js";

const SearchableSelect = ({ label, value, onChange, options, placeholder, disabled = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <div className="mb-5 relative">
      <label className="block text-xs font-light tracking-widest text-slate-400 uppercase mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          disabled={disabled}
          placeholder={value || placeholder}
          value={searchTerm}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/80 border border-blue-200 rounded-sm px-4 py-3 text-sm font-light text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
        />
        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-blue-100 rounded-sm shadow-xl max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(opt);
                    setSearchTerm("");
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 cursor-pointer"
                >
                  {opt}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-slate-400">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder }) => (
  <div className="mb-5">
    <label className="block text-xs font-light tracking-widest text-slate-400 uppercase mb-2">
      {label}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/80 border border-blue-200 rounded-sm px-4 py-3 text-sm font-light text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
    />
  </div>
);

// ── embedded: true  → rendered inside DashboardPage (no navbar)
// ── embedded: false → standalone page (with navbar + logout)
const AdminLevelPage = ({ embedded = false }) => {
  const navigate = useNavigate();

  const [developerName, setDeveloperName] = useState("");
  const [adminLevel, setAdminLevel] = useState("");
  const [adminName, setAdminName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingAdmin, setExistingAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("developerName");
    if (!token) { navigate("/"); return; }
    if (name) setDeveloperName(name);
  }, [navigate]);

  const states = Object.keys(LOCATION_DATA);
  const districts = selectedState ? Object.keys(LOCATION_DATA[selectedState]) : [];
  const municipalities =
    selectedState && selectedDistrict
      ? LOCATION_DATA[selectedState][selectedDistrict]
      : [];

  const handleLevelChange = (level) => {
    setAdminLevel(level);
    setAdminName("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedMunicipality("");
    setAdminKey("");
    setSubmitted(false);
    setError("");
    setExistingAdmin(null);
  };

  const handleSubmit = async () => {
    if (!adminName.trim()) { setError("Admin name is required."); return; }
    if (!selectedState) { setError("Please select a state."); return; }
    if ((adminLevel === "district" || adminLevel === "municipality") && !selectedDistrict) {
      setError("Please select a district."); return;
    }
    if (adminLevel === "municipality" && !selectedMunicipality) {
      setError("Please select a municipality."); return;
    }

    setError(""); setExistingAdmin(null); setSubmitted(false); setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        adminLevel, adminName, state: selectedState,
        district: selectedDistrict || "",
        municipality: selectedMunicipality || "",
      };
      const response = await axiosInstance.post("/key/generate-key", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setAdminKey(response.data.data.key);
        setSubmitted(true);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setExistingAdmin(err.response.data.existingAdmin);
      } else {
        setError(err.response?.data?.message || "Failed to generate key.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("developerName");
    navigate("/");
  };

  // ── Wrapper differs based on embedded mode ─────────────────────────────────
  const content = (
    <div className={`flex-1 flex flex-col ${embedded ? "" : "min-h-screen bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200"}`}>

      {/* Standalone-only navbar */}
      {!embedded && (
        <nav className="flex items-center justify-between px-10 py-4 bg-white/60 backdrop-blur-sm border-b border-white/50">
          <span className="text-lg font-light tracking-widest text-slate-700 uppercase">HydraOne</span>
          <div className="flex items-center gap-6">
            <span className="text-xs tracking-widest text-slate-500 uppercase">
              Developer: <span className="text-slate-700 font-medium">{developerName}</span>
            </span>
            <button onClick={handleLogout} className="bg-slate-700 hover:bg-slate-800 active:scale-95 text-white text-xs font-light tracking-widest uppercase px-5 py-2 rounded-sm transition">
              Logout
            </button>
          </div>
        </nav>
      )}

      <div className="flex-1 flex flex-col items-center justify-center py-14 px-4">
        <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded shadow-lg w-full max-w-lg px-12 py-10">

          {/* Page heading when embedded */}
          {embedded && (
            <div className="mb-6">
              <p className="text-xs font-light tracking-widest text-slate-400 uppercase mb-1">Developer Console</p>
              <h1 className="text-xl font-light tracking-wide text-slate-700">Generate Admin Key</h1>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-light tracking-widest text-slate-500 uppercase whitespace-nowrap">Admin Level</span>
            <select
              value={adminLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="flex-1 bg-white/80 border border-blue-200 rounded-sm px-4 py-2 text-sm font-light text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            >
              <option value="" disabled>Select level</option>
              <option value="state">State</option>
              <option value="district">District</option>
              <option value="municipality">Municipality</option>
            </select>
          </div>

          {adminLevel && (
            <>
              <InputField label="Admin Name" value={adminName} onChange={setAdminName} placeholder="Enter admin name" />

              <SearchableSelect
                label="State" value={selectedState}
                onChange={(val) => { setSelectedState(val); setSelectedDistrict(""); setSelectedMunicipality(""); }}
                options={states} placeholder="Type to search state"
              />

              {(adminLevel === "district" || adminLevel === "municipality") && (
                <SearchableSelect
                  label="District" value={selectedDistrict} disabled={!selectedState}
                  onChange={(val) => { setSelectedDistrict(val); setSelectedMunicipality(""); }}
                  options={districts} placeholder="Select district"
                />
              )}

              {adminLevel === "municipality" && (
                <SearchableSelect
                  label="Municipality" value={selectedMunicipality} disabled={!selectedDistrict}
                  onChange={setSelectedMunicipality} options={municipalities} placeholder="Select municipality"
                />
              )}

              {error && <p className="text-red-400 text-xs text-center mb-4 tracking-wide">{error}</p>}

              <button
                onClick={handleSubmit} disabled={loading}
                className="w-full bg-slate-700 hover:bg-slate-800 active:scale-95 text-white text-xs font-light tracking-widest uppercase py-3 rounded-sm transition mt-2"
              >
                {loading ? "Checking..." : "Submit"}
              </button>

              {submitted && adminKey && (
                <div className="mt-6 border border-blue-200 rounded-sm bg-blue-50/60 px-5 py-4">
                  <p className="text-xs tracking-widest text-slate-400 uppercase mb-2">Admin Key</p>
                  <p className="text-sm font-mono text-slate-700 break-all">{adminKey}</p>
                </div>
              )}

              {existingAdmin && (
                <div className="mt-6 border border-yellow-200 rounded-sm bg-yellow-50 px-5 py-4">
                  <p className="text-xs tracking-widest text-yellow-600 uppercase mb-2">Admin Already Exists</p>
                  <p className="text-sm text-slate-700">
                    <strong>{existingAdmin.adminName}</strong> already manages this area.
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {!embedded && (
        <footer className="text-center py-5 text-xs tracking-widest text-slate-400 uppercase">
          © 2026 HydraOne · Admin Access Only
        </footer>
      )}

    </div>
  );

  return content;
};

export default AdminLevelPage;