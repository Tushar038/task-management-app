import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import api from "../api/axios";

function ManagerDashboard() {
  const { user, loading } = useAuth();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    if (!user) return;

    api.get("/manager/overview")
      .then(res => setOverview(res.data))
      .catch(err => console.error("Manager overview error:", err));
  }, [user]);

  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (!user) return <Layout><p>Unauthorized</p></Layout>;

  return (
    <Layout>
      <h1>Manager Dashboard</h1>

      {!overview ? (
        <p>Loading overview...</p>
      ) : (
        <div className="grid">
          <div className="card">
            <h3>Teams Managed</h3>
            <p>{overview.teams_managed ?? 0}</p>
          </div>

          <div className="card">
            <h3>Total Members</h3>
            <p>{overview.total_members ?? 0}</p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ManagerDashboard;
