// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import "./Navbar.css";

// function Navbar() {
//   const { logout, user } = useAuth();

//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         <strong>Task Managment App</strong>
//       </div>

//       <div className="nav-links">
//         <Link to="/dashboard">Dashboard</Link>
//         <Link to="/teams">Teams</Link>
//         <Link to="/tasks">Tasks</Link>
//         {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
//         {user?.role === "MANAGER" && <Link to="/manager">Manager</Link>}
//       </div>

//       <div className="nav-actions">
//         <button onClick={logout}>Logout</button>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { logout, user } = useAuth();
  const location = useLocation(); // To highlight the active link

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-icon">⚡</span>
        <strong>TaskFlow</strong>
      </div>

      <div className="nav-links">
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>Dashboard</Link>
        <Link to="/teams" className={location.pathname === "/teams" ? "active" : ""}>Teams</Link>
        <Link to="/tasks" className={location.pathname === "/tasks" ? "active" : ""}>Tasks</Link>
        {user?.role === "ADMIN" && <Link to="/admin" className="role-link admin">Admin</Link>}
        {user?.role === "MANAGER" && <Link to="/manager" className="role-link manager">Manager</Link>}
      </div>

      <div className="nav-actions">
        {user && <span className="user-tag">{user.role}</span>}
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
