import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <Layout><p>Loading...</p></Layout>;
  if (!user) return <Layout><p>Unauthorized</p></Layout>;

  return (
    <Layout>
      <h1>Dashboard</h1>

      <div className="card">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </Layout>
  );
}

export default Dashboard;
