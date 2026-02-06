import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchTasks, createTask, updateTaskStatus } from "../api/tasks";
import { fetchTeams, fetchTeamMembers } from "../api/teams";

function Tasks() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);

  const [title, setTitle] = useState("");
  const [teamId, setTeamId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Load tasks
  const loadTasks = async () => {
    const res = await fetchTasks();
    setTasks(res.data);
  };

  // Initial load
  useEffect(() => {
    loadTasks();

    if (user.role !== "USER") {
      fetchTeams().then(res => setTeams(res.data));
    }
  }, []);

  // Load members when team changes
  useEffect(() => {
    if (!teamId) return;

    fetchTeamMembers(teamId).then(res => {
      setMembers(res.data);
    });
  }, [teamId]);

  // Create task
  const handleCreateTask = async () => {
    if (!title || !teamId || !assignedTo) {
      alert("Fill all fields");
      return;
    }

    await createTask({
      title,
      team_id: Number(teamId),
      assigned_to_id: Number(assignedTo),
    });

    setTitle("");
    setTeamId("");
    setAssignedTo("");
    loadTasks();
  };

  // Update task status
  const changeStatus = async (taskId, status) => {
    await updateTaskStatus(taskId, { status });
    loadTasks();
  };

  return (
    <Layout>
      <h1>{user.role === "USER" ? "My Tasks" : "Team Tasks"}</h1>

      {/* Create Task Section (Manager only) */}
      {user.role !== "USER" && (
        <div className="card">
          <h3>Create Task</h3>

          <input
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <select value={teamId} onChange={e => setTeamId(e.target.value)}>
            <option value="">Select Team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            disabled={!teamId}
          >
            <option value="">Assign Member</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.email}
              </option>
            ))}
          </select>

          <button onClick={handleCreateTask}>Create Task</button>
        </div>
      )}

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="empty">
          <h3>No tasks yet</h3>
        </div>
      ) : (
        tasks.map(task => (
          <div key={task.id} className="card">
            <h4>{task.title}</h4>

            {/* Status Badge */}
            <div className={`badge ${task.status.toLowerCase()}`}>
              {task.status.replace("_", " ")}
            </div>

            {/* Status Controls */}
            {(user.role === "MANAGER" ||
              task.assigned_to_id === user.id) && (
              <div className="actions">
                {task.status === "TODO" && (
                  <button
                    onClick={() =>
                      changeStatus(task.id, "IN_PROGRESS")
                    }
                  >
                    Start
                  </button>
                )}

                {task.status === "IN_PROGRESS" && (
                  <button
                    onClick={() =>
                      changeStatus(task.id, "DONE")
                    }
                  >
                    Done
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </Layout>
  );
}

export default Tasks;
