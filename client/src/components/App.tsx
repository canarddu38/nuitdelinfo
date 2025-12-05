import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../context/auth/AuthContext";
import ProtectedRoute from "../context/auth/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Relword from "../pages/Relword";
import Wordle from "../pages/Wordle";
import Quiz from "../pages/Quiz";
import LinuxInstaller from "../pages/LinuxInstaller";
import Memo from "../pages/Memo";
import Reco from "../pages/Reco";

export default function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rel" element={<Relword />} />
			<Route path="/wordle" element={<Wordle />} />
			<Route path="/quiz" element={<Quiz />} />
			<Route path="/linux" element={<LinuxInstaller />} />
			<Route path="/memo" element={<Memo />} />
			<Route path="/reco" element={<Reco />} />
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}
