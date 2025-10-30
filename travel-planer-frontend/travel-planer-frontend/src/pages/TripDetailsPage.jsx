import { useState } from "react";
import { sendInvite } from "../services/inviteService";

export default function TripDetailsPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [trip, setTrip] = useState(null);

  const handleInvite = async () => {
    try {
      if (!email) {
        setMessage("Введіть email");
        return;
      }
      await sendInvite(trip.id, email);
      setMessage("✅ Запрошення надіслано!");
      setEmail("");
    } catch (err) {
      setMessage("❌ Помилка при надсиланні запрошення");
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{trip?.name}</h1>
      <p className="mb-6">{trip?.description}</p>

      <div className="flex items-center gap-2">
        <input
          type="email"
          placeholder="Email для запрошення"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 w-64"
        />
        <button
          onClick={handleInvite}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Надіслати запрошення
        </button>
      </div>

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
