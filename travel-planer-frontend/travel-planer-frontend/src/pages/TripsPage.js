// src/pages/TripsPage.js
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { fetchTrips, createTrip } from "../services/api";

export default function TripsPage() {
  const { logout } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await fetchTrips();
        setTrips(data);
      } catch (error) {
        console.error("Помилка завантаження подорожей:", error);
      }
    };
    loadTrips();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await createTrip(newTrip);
      setTrips((prev) => [...prev, created]);
      setNewTrip({ title: "", description: "" });
    } catch (error) {
      console.error("Помилка створення подорожі:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h2>🌍 Мої подорожі</h2>

      <button onClick={logout} style={{ marginBottom: "20px" }}>
        Вийти
      </button>

      <form onSubmit={handleCreateTrip}>
        <input
          type="text"
          placeholder="Назва подорожі"
          value={newTrip.title}
          onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Опис"
          value={newTrip.description}
          onChange={(e) => setNewTrip({ ...newTrip, description: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Створюємо..." : "Додати подорож"}
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {trips.map((trip) => (
          <li
            key={trip.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{trip.title}</h3>
            <p>{trip.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
