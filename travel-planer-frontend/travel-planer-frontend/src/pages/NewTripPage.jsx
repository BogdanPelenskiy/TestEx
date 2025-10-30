import React, { useEffect, useState } from "react";
import { getTrips } from "../services/tripService";
import { useNavigate } from "react-router-dom";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (err) {
        console.error("Помилка при завантаженні подорожей:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-blue-600 text-lg animate-pulse">Завантаження подорожей...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-blue-700">Мої подорожі 🌍</h1>
        <button
          onClick={() => navigate("/new-trip")}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-2xl shadow-md hover:scale-105 transition-transform"
        >
          ➕ Нова подорож
        </button>
      </div>

      {trips.length === 0 ? (
        <p className="text-gray-600 text-center mt-20">Ще немає подорожей 😔</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => navigate(`/trips/${trip.id}`)}
              className="cursor-pointer bg-white/90 backdrop-blur-lg rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:scale-[1.02] transition-transform"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">{trip.title}</h2>
              <p className="text-gray-600 mb-3 line-clamp-2">{trip.description || "Без опису"}</p>
              <p className="text-sm text-gray-500">
                📅 {trip.startDate} — {trip.endDate}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
