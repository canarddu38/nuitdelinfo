import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../context/auth/AuthContext";
import ProtectedRoute from "../context/auth/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";

export default function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}
