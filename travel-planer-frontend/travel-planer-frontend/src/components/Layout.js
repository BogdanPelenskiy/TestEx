import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Travel Planner ✈️</h1>
        <nav className="flex gap-6">
          <Link to="/" className="hover:text-blue-600 font-medium">
            My Trips
          </Link>
          <Link to="/new" className="hover:text-blue-600 font-medium">
            + New Trip
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="flex-1 p-8">
        <Outlet />
      </main>

      <footer className="bg-gray-100 text-center py-3 text-sm text-gray-500">
        © 2025 Travel Planner
      </footer>
    </div>
  );
}
