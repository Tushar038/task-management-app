import { useEffect, useState } from "react";
import { createTeam, fetchTeams } from "../api/teams";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const loadTeams = async () => {
    const res = await fetchTeams();
    setTeams(res.data);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreate = async () => {
    try {
      setError("");
      await createTeam(name);
      setName("");
      loadTeams();
    } catch {
      setError("You are not allowed to create teams");
    }
  };

  return (
    <div className="page">
      {/* Create Team */}
      <div className="card">
        <h2>Teams</h2>

        <input
          placeholder="Team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleCreate}>Create Team</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* Existing Teams */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Existing Teams</h3>
        <ul>
          {teams.map((team) => (
            <li key={team.id}>{team.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Teams;
