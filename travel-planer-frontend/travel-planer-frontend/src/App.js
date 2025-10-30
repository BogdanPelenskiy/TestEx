import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TripsPage from "./pages/TripsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewTripPage from "./pages/NewTripPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import TripAccessPage from "./pages/TripAccessPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trips/new" element={<NewTripPage />} />
        <Route path="/trips/:id" element={<TripDetailsPage />} />
        <Route path="/trip-access/:inviteCode" element={<TripAccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
