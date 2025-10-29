// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TripsPage from "./pages/TripsPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trips" element={token ? <TripsPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/trips" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
