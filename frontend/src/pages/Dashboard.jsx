import { useEffect, useState } from "react";
import api from "../api/axios";
import { getToken, removeToken } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import "../components/Layout.css";

/* 🔹 Apply dark mode on page load */
document.documentElement.classList.toggle(
  "dark",
  localStorage.getItem("darkMode") === "true"
);

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  /* 🔹 Dark mode state */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem("darkMode", newValue);
    document.documentElement.classList.toggle("dark", newValue);
  };

  useEffect(() => {
    api
      .get("/auth/me", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        removeToken();
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="page">
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/tasks">Tasks</Link>

        <button
          className="secondary"
          onClick={toggleDarkMode}
          style={{ marginLeft: "10px" }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          className="secondary"
          style={{ float: "right" }}
        >
          Logout
        </button>
      </nav>

      <div className="card">
        <h2>Dashboard</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
