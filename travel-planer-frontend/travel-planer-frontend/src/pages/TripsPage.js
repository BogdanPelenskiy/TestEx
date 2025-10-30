import { useState, useEffect } from "react";
import { createTrip, getTrips, deleteTrip } from "../services/tripService";
import { sendInvite } from "../services/inviteService";
import { useNavigate } from "react-router-dom";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState({});
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
    fetchTrips();
  }, []);

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
    if (!inviteEmail[tripId]?.trim()) return alert("Введіть email друга!");
    try {
      await sendInvite({ tripId, email: inviteEmail[tripId] });
      alert(`✅ Запрошення надіслано на ${inviteEmail[tripId]}`);
      setInviteEmail((prev) => ({ ...prev, [tripId]: "" }));
    } catch (error) {
      console.error("❌ handleInvite error:", error);
      alert("Помилка при надсиланні запрошення");
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Ви впевнені, що хочете видалити подорож?")) return;
    try {
      await deleteTrip(tripId);
      setTrips(trips.filter((t) => t.id !== tripId));
    } catch (error) {
      console.error("❌ handleDeleteTrip error:", error);
      alert("Не вдалося видалити подорож");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* 🔹 Верхня панель */}
      <header className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3448/3448629.png"
            alt="logo"
            className="w-8 h-8"
          />
          <h1 className="text-lg font-semibold">Travel Planner</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">👋 {userName || "Користувач"}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 font-semibold px-3 py-1 rounded-lg hover:bg-gray-100 transition"
          >
            Вийти
          </button>
        </div>
      </header>

      {/* 🔹 Основна частина */}
      <main className="flex flex-col items-center p-6 flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center">Мої подорожі</h1>

        {/* Блок створення */}
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
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{trip.title}</h2>
                      <p className="text-gray-600 mb-4">{trip.description || "Без опису"}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      ✖
                    </button>
                  </div>

                  {/* Запрошення */}
                  <div className="flex gap-2 items-center">
                    <input
                      type="email"
                      placeholder="Email друга"
                      className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring focus:ring-blue-200"
                      value={inviteEmail[trip.id] || ""}
                      onChange={(e) =>
                        setInviteEmail((prev) => ({
                          ...prev,
                          [trip.id]: e.target.value,
                        }))
                      }
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
      </main>
    </div>
  );
}
