import { useEffect, useState } from "react";
import { getTrips, deleteTrip, createTrip } from "../services/tripService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (err) {
      console.error("❌ Помилка при завантаженні подорожей:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити цю подорож?")) return;
    try {
      await deleteTrip(id);
      loadTrips();
    } catch (err) {
      console.error("❌ Помилка при видаленні:", err);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) return alert("Введіть назву подорожі");
    try {
      await createTrip({ title, description });
      setTitle("");
      setDescription("");
      setShowForm(false);
      loadTrips();
    } catch (err) {
      console.error("❌ Помилка при створенні подорожі:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Верхня панель */}
      <Navbar user={user} />

      <div className="max-w-4xl mx-auto pt-24 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Мої подорожі</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            + Нова подорож
          </button>
        </div>

        {/* Форма створення нової подорожі */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-5 mb-8">
            <input
              type="text"
              placeholder="Назва подорожі"
              className="border w-full p-3 mb-3 rounded-lg focus:ring focus:ring-blue-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Опис (необов’язково)"
              className="border w-full p-3 mb-3 rounded-lg focus:ring focus:ring-blue-200"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Створити
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
              >
                Скасувати
              </button>
            </div>
          </div>
        )}

        {/* Список подорожей */}
        {trips.length === 0 ? (
          <p className="text-gray-600 text-center">Поки немає жодної подорожі 👆</p>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="flex justify-between items-center bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    {trip.title}
                  </h2>
                  <p className="text-gray-600">
                    {trip.description || "Без опису"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Деталі
                  </button>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;
