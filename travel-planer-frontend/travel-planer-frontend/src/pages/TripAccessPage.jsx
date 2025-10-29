import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function TripAccessPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [invites, setInvites] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // === Завантаження даних подорожі та інвайтів ===
  useEffect(() => {
    async function fetchData() {
      try {
        const [tripRes, inviteRes] = await Promise.all([
          api.get(`/trips/${id}`),
          api.get(`/trips/${id}/invites`),
        ]);
        setTrip(tripRes.data.trip);
        setInvites(inviteRes.data);
      } catch (err) {
        console.error("Помилка завантаження доступів:", err);
        setError("Не вдалося завантажити дані");
      }
    }
    fetchData();
  }, [id]);

  // === Надіслати інвайт ===
  async function handleInvite(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post(`/trips/${id}/invites`, { email });
      setInvites([...invites, res.data]);
      setEmail("");
    } catch (err) {
      console.error("Помилка надсилання інвайту:", err);
      setError(err.response?.data?.message || "Не вдалося надіслати інвайт");
    } finally {
      setLoading(false);
    }
  }

  if (!trip) return <p>Завантаження...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>🔐 Доступ до подорожі: {trip.title}</h2>
      <p>Ви можете запросити користувачів до співпраці (роль: Collaborator).</p>

      <form onSubmit={handleInvite} style={{ marginTop: "20px" }}>
        <input
          type="email"
          placeholder="Email користувача"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Відправляю..." : "📨 Надіслати інвайт"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3 style={{ marginTop: "30px" }}>📋 Список інвайтів</h3>
      {invites.length === 0 ? (
        <p>Поки що немає запрошень.</p>
      ) : (
        <ul>
          {invites.map((invite) => (
            <li key={invite.id}>
              <strong>{invite.email}</strong> — {invite.status}
              {invite.status === "pending" && (
                <span> (очікує підтвердження)</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
