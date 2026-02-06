import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Toast from "../components/Toast";
import { fetchTeams, createTeam, addMember } from "../api/teams";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [userId, setUserId] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const loadTeams = async () => {
    const res = await fetchTeams();
    setTeams(res.data);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreate = async () => {
    try {
      await createTeam({ name });
      setToast({ message: "Team created", type: "success" });
      setName("");
      loadTeams();
    } catch {
      setToast({ message: "Failed to create team", type: "error" });
    }
  };

  const handleAddMember = async () => {
    try {
      await addMember(teamId, userId);
      setToast({ message: "Member added", type: "success" });
      setUserId("");
    } catch {
      setToast({ message: "Failed to add member", type: "error" });
    }
  };

  return (
    <Layout>
      <Toast message={toast.message} type={toast.type} />

      <h1>Teams</h1>

      <div className="card">
        <h3>Create Team</h3>
        <input
          placeholder="Team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <div className="card">
        <h3>Add Member</h3>
        <input
          placeholder="Team ID"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />
        <input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handleAddMember}>Add</button>
      </div>

      {teams.length === 0 ? (
        <p className="muted">No teams created yet.</p>
      ) : (
        <div className="grid">
          {teams.map((team) => (
            <div className="card" key={team.id}>
              <strong>{team.name}</strong>
              <p className="muted">ID: {team.id}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Teams;
