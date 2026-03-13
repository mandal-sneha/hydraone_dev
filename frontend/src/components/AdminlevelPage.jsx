import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Hardcoded West Bengal data
const WB_DATA = {
  "West Bengal": {
    "Kolkata": ["Ward 1 - Bowbazar", "Ward 2 - Shyambazar", "Ward 3 - Tollygunge", "Ward 4 - Behala"],
    "Howrah": ["Howrah Municipality", "Bally Municipality", "Uluberia Municipality"],
    "North 24 Parganas": ["Barasat Municipality", "Barrackpore Municipality", "Titagarh Municipality"],
    "South 24 Parganas": ["Budge Budge Municipality", "Rajpur-Sonarpur Municipality"],
    "Darjeeling": ["Darjeeling Municipality", "Siliguri Municipal Corporation", "Kurseong Municipality"],
    "Murshidabad": ["Berhampore Municipality", "Jiaganj-Azimganj Municipality"],
    "Burdwan": ["Asansol Municipal Corporation", "Durgapur Municipal Corporation", "Burdwan Municipality"],
    "Nadia": ["Krishnanagar Municipality", "Nabadwip Municipality", "Ranaghat Municipality"],
  }
};

// Hardcoded admin keys for testing
const ADMIN_KEYS = {
  state: {
    "West Bengal": "WB-STATE-ADM-2025-XK9",
  },
  district: {
    "Kolkata": "WB-DIST-KOL-2025-AB3",
    "Howrah": "WB-DIST-HWH-2025-CD7",
    "North 24 Parganas": "WB-DIST-N24-2025-EF1",
    "South 24 Parganas": "WB-DIST-S24-2025-GH5",
    "Darjeeling": "WB-DIST-DJL-2025-IJ2",
    "Murshidabad": "WB-DIST-MSD-2025-KL8",
    "Burdwan": "WB-DIST-BWN-2025-MN4",
    "Nadia": "WB-DIST-NDI-2025-OP6",
  },
  municipality: {
    "Ward 1 - Bowbazar": "WB-MUN-BOW-2025-QR3",
    "Ward 2 - Shyambazar": "WB-MUN-SHY-2025-ST9",
    "Ward 3 - Tollygunge": "WB-MUN-TOL-2025-UV5",
    "Ward 4 - Behala": "WB-MUN-BEH-2025-WX1",
    "Howrah Municipality": "WB-MUN-HWH-2025-YZ7",
    "Bally Municipality": "WB-MUN-BAL-2025-AA2",
    "Uluberia Municipality": "WB-MUN-ULU-2025-BB8",
    "Barasat Municipality": "WB-MUN-BAR-2025-CC4",
    "Barrackpore Municipality": "WB-MUN-BRP-2025-DD6",
    "Titagarh Municipality": "WB-MUN-TTG-2025-EE0",
    "Budge Budge Municipality": "WB-MUN-BDB-2025-FF3",
    "Rajpur-Sonarpur Municipality": "WB-MUN-RSP-2025-GG9",
    "Darjeeling Municipality": "WB-MUN-DJL-2025-HH1",
    "Siliguri Municipal Corporation": "WB-MUN-SLG-2025-II5",
    "Kurseong Municipality": "WB-MUN-KRS-2025-JJ7",
    "Berhampore Municipality": "WB-MUN-BHP-2025-KK2",
    "Jiaganj-Azimganj Municipality": "WB-MUN-JAG-2025-LL8",
    "Asansol Municipal Corporation": "WB-MUN-ASN-2025-MM4",
    "Durgapur Municipal Corporation": "WB-MUN-DGP-2025-NN6",
    "Burdwan Municipality": "WB-MUN-BWN-2025-OO0",
    "Krishnanagar Municipality": "WB-MUN-KNG-2025-PP3",
    "Nabadwip Municipality": "WB-MUN-NBD-2025-QQ9",
    "Ranaghat Municipality": "WB-MUN-RNG-2025-RR1",
  }
};

const STATES = ["West Bengal"];
const DISTRICTS = Object.keys(WB_DATA["West Bengal"]);

const SelectField = ({ label, value, onChange, options, placeholder }) => (
  <div className="mb-5">
    <label className="block text-xs font-light tracking-widest text-slate-400 uppercase mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/80 border border-blue-200 rounded-sm px-4 py-3 text-sm font-light text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition appearance-none cursor-pointer"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

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

  const municipalities = selectedDistrict
    ? WB_DATA["West Bengal"][selectedDistrict] || []
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
  };

  const handleSubmit = () => {
    if (!adminName.trim()) { setError("Admin name is required."); return; }
    if (!selectedState) { setError("Please select a state."); return; }
    if ((adminLevel === "district" || adminLevel === "municipality") && !selectedDistrict) {
      setError("Please select a district."); return;
    }
    if (adminLevel === "municipality" && !selectedMunicipality) {
      setError("Please select a municipality."); return;
    }

    setError("");
    let key = "";
    if (adminLevel === "state") key = ADMIN_KEYS.state[selectedState] || "WB-STATE-GEN-2025-XX0";
    else if (adminLevel === "district") key = ADMIN_KEYS.district[selectedDistrict] || "WB-DIST-GEN-2025-XX0";
    else if (adminLevel === "municipality") key = ADMIN_KEYS.municipality[selectedMunicipality] || "WB-MUN-GEN-2025-XX0";

    setAdminKey(key);
    setSubmitted(true);
  };

  const showForm = adminLevel !== "";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-slate-100 to-blue-200">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-4 bg-white/60 backdrop-blur-sm border-b border-white/50">
        <span className="text-lg font-light tracking-widest text-slate-700 uppercase">HydraOne</span>
        <button
          onClick={() => { localStorage.removeItem("isLoggedIn"); navigate("/"); }}
          className="bg-slate-700 hover:bg-slate-800 active:scale-95 text-white text-xs font-light tracking-widest uppercase px-5 py-2 rounded-sm transition"
        >
          Logout
        </button>
      </nav>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center py-14 px-4">

        <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded shadow-lg w-full max-w-lg px-12 py-10">

          {/* Admin Level Dropdown */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-light tracking-widest text-slate-500 uppercase whitespace-nowrap">
              Admin Level
            </span>
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

          {/* Dynamic Form */}
          {showForm && (
            <>
              <InputField
                label="Admin Name"
                value={adminName}
                onChange={setAdminName}
                placeholder="Enter admin name"
              />

              <SelectField
                label="State"
                value={selectedState}
                onChange={setSelectedState}
                options={STATES}
                placeholder="Select state"
              />

              {(adminLevel === "district" || adminLevel === "municipality") && (
                <SelectField
                  label="District"
                  value={selectedDistrict}
                  onChange={(val) => { setSelectedDistrict(val); setSelectedMunicipality(""); }}
                  options={DISTRICTS}
                  placeholder="Select district"
                />
              )}

              {adminLevel === "municipality" && (
                <SelectField
                  label="Municipality"
                  value={selectedMunicipality}
                  onChange={setSelectedMunicipality}
                  options={municipalities}
                  placeholder={selectedDistrict ? "Select municipality" : "Select a district first"}
                />
              )}

              {/* Error */}
              {error && (
                <p className="text-red-400 text-xs text-center mb-4 tracking-wide">{error}</p>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full bg-slate-700 hover:bg-slate-800 active:scale-95 text-white text-xs font-light tracking-widest uppercase py-3 rounded-sm transition mt-1"
              >
                Submit
              </button>

              {/* Admin Key Result */}
              {submitted && adminKey && (
                <div className="mt-6 border border-blue-200 rounded-sm bg-blue-50/60 px-5 py-4">
                  <p className="text-xs font-light tracking-widest text-slate-400 uppercase mb-2">
                    Admin Key
                  </p>
                  <p className="text-sm font-mono text-slate-700 tracking-wider break-all">
                    {adminKey}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-light">
                    Assigned to <span className="text-slate-600">{adminName}</span>
                    {adminLevel === "state" && <> · {selectedState}</>}
                    {adminLevel === "district" && <> · {selectedDistrict}, {selectedState}</>}
                    {adminLevel === "municipality" && <> · {selectedMunicipality}, {selectedDistrict}</>}
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-5 text-xs tracking-widest text-slate-400 uppercase">
        © 2026 HydraOne · Admin Access Only
      </footer>
    </div>
  );
};

export default AdminLevelPage;