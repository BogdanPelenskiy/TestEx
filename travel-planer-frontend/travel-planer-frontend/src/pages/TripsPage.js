import { useState, useEffect } from "react";
import { createTrip, getTrips } from "../services/tripService";
import { sendInvite } from "../services/inviteService";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTrips = async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (error) {
      console.error("❌ fetchTrips error:", error);
    }
  };

  const handleCreateTrip = async () => {
    if (!title.trim()) return alert("Введіть назву подорожі");
    setLoading(true);
    try {
      const newTrip = await createTrip({ title, description });
      setTrips([...trips, newTrip]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("❌ handleCreateTrip error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (tripId) => {
    if (!inviteEmail.trim()) return alert("Введіть email друга!");
    try {
      await sendInvite({ tripId, email: inviteEmail });
      alert(`✅ Запрошення надіслано на ${inviteEmail}`);
      setInviteEmail("");
    } catch (error) {
      console.error("❌ handleInvite error:", error);
      alert("Помилка при надсиланні запрошення");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Мої подорожі</h1>

      {/* Блок створення нової подорожі */}
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg mb-8">
        <input
          type="text"
          placeholder="Назва подорожі"
          className="border rounded-lg w-full p-3 mb-3 focus:outline-none focus:ring focus:ring-blue-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Опис (необов’язково)"
          className="border rounded-lg w-full p-3 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={handleCreateTrip}
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {loading ? "Створюється..." : "Створити подорож"}
        </button>
      </div>

      {/* Список подорожей */}
      <div className="w-full max-w-2xl">
        {trips.length === 0 ? (
          <p className="text-gray-600 text-center">
            Поки немає жодної подорожі. Створи першу вище 👆
          </p>
        ) : (
          <div className="grid gap-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {trip.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {trip.description || "Без опису"}
                </p>

                {/* Запрошення друга */}
                <div className="flex gap-2 items-center">
                  <input
                    type="email"
                    placeholder="Email друга"
                    className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring focus:ring-blue-200"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <button
                    onClick={() => handleInvite(trip.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Запросити
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
