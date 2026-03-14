import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import { LOCATION_DATA } from "../lib/locationData.js";

const SearchableSelect = ({ label, value, onChange, options, placeholder, disabled = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => 
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
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/80 border border-blue-200 rounded-sm px-4 py-3 text-sm font-light text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
        />
        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-blue-100 rounded-sm shadow-xl max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setSearchTerm("");
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 cursor-pointer transition"
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
      className="w-full bg-white/80 border border-blue-200 rounded-sm px-4 py-3 text-sm font-light text-slate-700 placeholder-slate-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
    />
  </div>
);

const AdminLevelPage = () => {
  const navigate = useNavigate();
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

  const states = Object.keys(LOCATION_DATA);
  const districts = selectedState ? Object.keys(LOCATION_DATA[selectedState]) : [];
  const municipalities = (selectedState && selectedDistrict) 
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

    setError("");
    setExistingAdmin(null);
    setSubmitted(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        adminLevel,
        adminName,
        state: selectedState,
        district: selectedDistrict || "",
        municipality: selectedMunicipality || ""
      };

      const response = await axiosInstance.post("/key/generate-key", payload, {
        headers: { Authorization: `Bearer ${token}` }
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">
      <nav className="flex items-center justify-between px-10 py-4 bg-white/60 backdrop-blur-sm border-b border-white/50">
        <span className="text-lg font-light tracking-widest text-slate-700 uppercase">HydraOne</span>
        <button
          onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("isLoggedIn"); navigate("/"); }}
          className="bg-slate-700 hover:bg-slate-800 active:scale-95 text-white text-xs font-light tracking-widest uppercase px-5 py-2 rounded-sm transition"
        >
          Logout
        </button>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center py-14 px-4">
        <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded shadow-lg w-full max-w-lg px-12 py-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-light tracking-widest text-slate-500 uppercase whitespace-nowrap">Admin Level</span>
            <select
              value={adminLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="flex-1 bg-white/80 border border-blue-200 rounded-sm px-4 py-2 text-sm font-light text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition appearance-none cursor-pointer"
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
              <SearchableSelect label="State" value={selectedState} onChange={(val) => { setSelectedState(val); setSelectedDistrict(""); setSelectedMunicipality(""); }} options={states} placeholder="Type to search state" />
              {(adminLevel === "district" || adminLevel === "municipality") && (
                <SearchableSelect label="District" value={selectedDistrict} disabled={!selectedState} onChange={(val) => { setSelectedDistrict(val); setSelectedMunicipality(""); }} options={districts} placeholder={selectedState ? "Type to search district" : "Select state first"} />
              )}
              {adminLevel === "municipality" && (
                <SearchableSelect label="Municipality" value={selectedMunicipality} disabled={!selectedDistrict} onChange={setSelectedMunicipality} options={municipalities} placeholder={selectedDistrict ? "Type to search municipality" : "Select district first"} />
              )}

              {error && <p className="text-red-400 text-xs text-center mb-4 tracking-wide">{error}</p>}

              {existingAdmin && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Existing Admin Found</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Admin <span className="font-semibold">{existingAdmin.adminName}</span> is already assigned to:
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-medium italic">
                    {existingAdmin.adminLevel === "state" && existingAdmin.state}
                    {existingAdmin.adminLevel === "district" && `${existingAdmin.district}, ${existingAdmin.state}`}
                    {existingAdmin.adminLevel === "municipality" && `${existingAdmin.municipality}, ${existingAdmin.district}, ${existingAdmin.state}`}
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full bg-slate-700 hover:bg-slate-800 active:scale-95 text-white text-xs font-light tracking-widest uppercase py-3 rounded-sm transition mt-1 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Checking..." : "Submit"}
              </button>

              {submitted && adminKey && (
                <div className="mt-6 border border-blue-200 rounded-sm bg-blue-50/60 px-5 py-4 animate-in fade-in duration-500">
                  <p className="text-xs font-light tracking-widest text-slate-400 uppercase mb-2">Admin Key</p>
                  <p className="text-sm font-mono text-slate-700 tracking-wider break-all">{adminKey}</p>
                  <p className="text-xs text-slate-400 mt-2 font-light">Assigned to <span className="text-slate-600 font-medium">{adminName}</span></p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="text-center py-5 text-xs tracking-widest text-slate-400 uppercase">© 2026 HydraOne · Admin Access Only</footer>
    </div>
  );
};

export default AdminLevelPage;