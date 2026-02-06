import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchAdminOverview } from "../api/admin";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
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

  // Convert backend summary to chart format
  const chartData = stats.task_status_summary
    ? Object.entries(stats.task_status_summary).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];
  const COLORS = {
    TODO: "#facc15",
    IN_PROGRESS: "#3b82f6",
    DONE: "#22c55e"
  };
  

  return (
    <Layout>
      <h1>Admin Dashboard</h1>

      <div className="grid">
        <div className="card">
          <h3>Total Users</h3>
          <p>{stats.users ?? 0}</p>
        </div>

        <div className="card">
          <h3>Total Teams</h3>
          <p>{stats.teams ?? 0}</p>
        </div>

        <div className="card">
          <h3>Total Tasks</h3>
          <p>{stats.tasks ?? 0}</p>
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
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[entry.name] || "#8884d8"} />
                ))}
              </Pie>

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
