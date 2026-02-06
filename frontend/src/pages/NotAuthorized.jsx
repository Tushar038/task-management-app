import { Link } from "react-router-dom";

function NotAuthorized() {
  return (
    <div className="page" style={{ textAlign: "center" }}>
      <h2>🚫 Access Denied</h2>
      <p>You do not have permission to access this page.</p>

      <Link to="/dashboard">
        <button className="secondary">Go to Dashboard</button>
      </Link>
    </div>
  );
}

export default NotAuthorized;
