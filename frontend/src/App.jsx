import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import AdminlevelPage from "./components/AdminlevelPage.jsx";
import ProtectedRoute from "../src/ProtectedRoute.jsx";

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/generate-admin-key"
          element={
            <ProtectedRoute>
              <AdminlevelPage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;