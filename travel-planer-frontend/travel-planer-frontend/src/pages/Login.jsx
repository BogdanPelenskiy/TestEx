import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ зберігаємо повного користувача
        navigate("/trips");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "❌ Невірні дані входу");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-200">
      <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Увійти до акаунту 🚀
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Пароль"
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Увійти
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Немає акаунту?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Зареєструватися
          </span>
        </p>
      </div>
    </div>
  );
}
