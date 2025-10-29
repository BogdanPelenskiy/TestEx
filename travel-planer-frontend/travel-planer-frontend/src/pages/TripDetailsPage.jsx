import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function TripDetailsPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState({
    locationName: "",
    notes: "",
    dayNumber: 1,
  });
  const [editingPlace, setEditingPlace] = useState(null);

  // === Завантаження подорожі ===
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/trips/${id}`);
        setTrip(res.data.trip);
        setPlaces(res.data.places || []);
      } catch (error) {
        console.error("Помилка завантаження подорожі:", error);
      }
    }
    fetchData();
  }, [id]);

  // === Додавання місця ===
  async function handleAddPlace(e) {
    e.preventDefault();
    try {
      const res = await api.post(`/trips/${id}/places`, newPlace);
      setPlaces([...places, res.data]);
      setNewPlace({ locationName: "", notes: "", dayNumber: 1 });
    } catch (error) {
      console.error("Помилка додавання місця:", error);
    }
  }

  // === Редагування місця ===
  function startEdit(place) {
    setEditingPlace(place);
  }

  async function handleEditPlace(e) {
    e.preventDefault();
    try {
      const res = await api.put(
        `/trips/${id}/places/${editingPlace.id}`,
        editingPlace
      );
      setPlaces(
        places.map((p) => (p.id === editingPlace.id ? res.data : p))
      );
      setEditingPlace(null);
    } catch (error) {
      console.error("Помилка оновлення місця:", error);
    }
  }

  // === Видалення місця ===
  async function handleDeletePlace(placeId) {
    if (!window.confirm("Видалити це місце?")) return;
    try {
      await api.delete(`/trips/${id}/places/${placeId}`);
      setPlaces(places.filter((p) => p.id !== placeId));
    } catch (error) {
      console.error("Помилка видалення місця:", error);
    }
  }

  if (!trip) return <p>Завантаження...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{trip.title}</h2>
      {trip.description && <p>{trip.description}</p>}
      <p>
        📅 {trip.startDate} – {trip.endDate}
      </p>

      <h3>Місця</h3>
      {places.length === 0 ? (
        <p>Ще немає місць у цій подорожі.</p>
      ) : (
        <ul>
          {places
            .sort((a, b) => a.dayNumber - b.dayNumber)
            .map((place) => (
              <li key={place.id}>
                <strong>День {place.dayNumber}:</strong> {place.locationName}
                {place.notes && <em> — {place.notes}</em>}
                <div style={{ marginTop: "5px" }}>
                  <button onClick={() => startEdit(place)}>✏️ Редагувати</button>
                  <button
                    onClick={() => handleDeletePlace(place.id)}
                    style={{ marginLeft: "8px", color: "red" }}
                  >
                    🗑️ Видалити
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}

      {editingPlace ? (
        <>
          <h4>Редагування місця</h4>
          <form onSubmit={handleEditPlace}>
            <input
              type="text"
              value={editingPlace.locationName}
              onChange={(e) =>
                setEditingPlace({
                  ...editingPlace,
                  locationName: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              value={editingPlace.notes || ""}
              onChange={(e) =>
                setEditingPlace({ ...editingPlace, notes: e.target.value })
              }
            />
            <input
              type="number"
              min="1"
              value={editingPlace.dayNumber}
              onChange={(e) =>
                setEditingPlace({
                  ...editingPlace,
                  dayNumber: parseInt(e.target.value),
                })
              }
              required
            />
            <button type="submit">💾 Зберегти</button>
            <button type="button" onClick={() => setEditingPlace(null)}>
              ❌ Скасувати
            </button>
          </form>
        </>
      ) : (
        <>
          <h4>Додати місце</h4>
          <form onSubmit={handleAddPlace}>
            <input
              type="text"
              placeholder="Назва місця"
              value={newPlace.locationName}
              onChange={(e) =>
                setNewPlace({ ...newPlace, locationName: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Нотатки"
              value={newPlace.notes}
              onChange={(e) =>
                setNewPlace({ ...newPlace, notes: e.target.value })
              }
            />
            <input
              type="number"
              min="1"
              placeholder="День"
              value={newPlace.dayNumber}
              onChange={(e) =>
                setNewPlace({
                  ...newPlace,
                  dayNumber: parseInt(e.target.value),
                })
              }
              required
            />
            <button type="submit">➕ Додати</button>
          </form>
        </>
      )}
    </div>
  );
}
