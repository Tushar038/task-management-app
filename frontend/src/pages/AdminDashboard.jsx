import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchAdminOverview } from "../api/admin";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchAdminOverview();
        setStats(res.data);
      } catch (err) {
        console.error("Admin stats error:", err);
      }
    };

    loadStats();
  }, []);

  if (!stats) {
    return (
      <Layout>
        <p>Loading dashboard...</p>
      </Layout>
    );
  }

  const chartData = stats.tasks_by_status
    ? Object.entries(stats.tasks_by_status).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];

  return (
    <Layout>
      <h1>Admin Dashboard</h1>

      <div className="grid">
        <div className="card">
          <h3>Total Users</h3>
          <p>{stats.total_users ?? 0}</p>
        </div>

        <div className="card">
          <h3>Total Teams</h3>
          <p>{stats.total_teams ?? 0}</p>
        </div>

        <div className="card">
          <h3>Total Tasks</h3>
          <p>{stats.total_tasks ?? 0}</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card">
          <h3>Tasks by Status</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Layout>
  );
}

export default AdminDashboard;
