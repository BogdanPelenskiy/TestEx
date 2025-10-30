import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTrips } from "../services/tripService";
import { sendInvite } from "../services/inviteService";
import Navbar from "../components/Navbar";

export default function TripDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [trip, setTrip] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");

    console.log(id)


  useEffect(() => {
    loadTrip();
  }, []);

  const loadTrip = async () => {
    const allTrips = await getTrips();
    const foundTrip = allTrips.find((t) => t.id === id || t.id === Number(id));
    setTrip(foundTrip);
  };

  const handleInvite = async () => {
    console.log(id)
    console.log(inviteEmail)

    if (!inviteEmail.trim()) return alert("Введіть email!");
    try {
      await sendInvite(id, inviteEmail);
      alert(`✅ Запрошення надіслано на ${inviteEmail}`);
      setInviteEmail("");
    } catch (err) {
      console.error(err);
      alert("❌ Помилка при надсиланні запрошення");
    }
  };

  if (!trip) return <p className="text-center mt-10">Завантаження...</p>;

  return (
    <div className="min-h-screen bg-gray-100 pt-20 p-6">
      <Navbar user={user} />

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
        <p className="text-gray-700 mb-6">{trip.description}</p>

        <button
          onClick={() => navigate("/trips")}
          className="mb-6 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
        >
          ⬅ Назад
        </button>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">Запросити друга</h2>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email друга"
              className="border rounded-lg p-2 flex-1"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button
              onClick={handleInvite}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Запросити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
