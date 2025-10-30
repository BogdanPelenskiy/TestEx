import { useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between fixed top-0 left-0 w-full z-50">
      <div className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate("/trips")}>
        🌍 Travel Planner
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">{user?.name || "Користувач"}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Вийти
        </button>
      </div>
    </nav>
  );
}
