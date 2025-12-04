import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../context/auth/AuthContext";
import ProtectedRoute from "../context/auth/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <Home />
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
