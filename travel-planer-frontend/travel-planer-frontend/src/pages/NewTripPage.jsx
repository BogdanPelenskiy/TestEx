import React, { useState } from "react";
import { createTrip } from "../services/tripService";
import { useNavigate } from "react-router-dom";

const NewTripPage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrip(form);
      navigate("/trips");
    } catch (err) {
      console.error(err);
      setError("Не вдалося створити подорож 😢");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-semibold mb-4">Створити нову подорож</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-96 flex flex-col gap-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Назва подорожі"
          value={form.title}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Опис"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Створити
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default NewTripPage;
