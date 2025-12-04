import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../context/auth/AuthContext";
import ProtectedRoute from "../context/auth/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Test from "../pages/test";

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
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}
