import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TripsPage from "./pages/TripsPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import TripAccessPage from "./pages/TripAccessPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/trips/:id" element={<TripDetailsPage />} />
        <Route path="/trips/:id/access" element={<TripAccessPage />} /> 

      </Routes>
    </Router>
  );
}

export default App;
