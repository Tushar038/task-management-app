import { useEffect, useState } from "react";
import {
  createTask,
  fetchTasks,
  updateTaskStatus,
} from "../api/tasks";
import { fetchTeams } from "../api/teams";
import Toast from "../components/Toast";

/* 🔹 Status badge helper */
const getStatusClass = (status) => {
  if (status === "TODO") return "badge todo";
  if (status === "IN_PROGRESS") return "badge in-progress";
  if (status === "DONE") return "badge done";
  return "badge";
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState("");
  const [assignedToId, setAssignedToId] = useState("");

  const [toast, setToast] = useState({ message: "", type: "" });

  const loadData = async () => {
    const taskRes = await fetchTasks();
    const teamRes = await fetchTeams();
    setTasks(taskRes.data);
    setTeams(teamRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* 🔹 Create task with proper backend error handling */
  const handleCreate = async () => {
    try {
      await createTask({
        title,
        description,
        team_id: Number(teamId),
        assigned_to_id: Number(assignedToId),
      });

      setToast({ message: "Task created successfully", type: "success" });
      setTimeout(() => setToast({ message: "", type: "" }), 2000);

      setTitle("");
      setDescription("");
      setAssignedToId("");
      loadData();
    } catch (error) {
      const message =
        error.response?.data?.detail?.message ||
        "Failed to create task";

      setToast({ message, type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 2000);
    }
  };

  /* 🔹 Update task status with proper backend error handling */
  const handleStatusChange = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
      setToast({ message: "Task status updated", type: "success" });
      setTimeout(() => setToast({ message: "", type: "" }), 2000);
      loadData();
    } catch (error) {
      const message =
        error.response?.data?.detail?.message ||
        "Failed to update task status";

      setToast({ message, type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 2000);
    }
  };

  return (
    <div>
      {/* 🔔 Toast */}
      <Toast message={toast.message} type={toast.type} />

      <h2>Tasks</h2>

      <h3>Create Task</h3>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select value={teamId} onChange={(e) => setTeamId(e.target.value)}>
        <option value="">Select Team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Assign to User ID"
        value={assignedToId}
        onChange={(e) => setAssignedToId(e.target.value)}
      />

      <button onClick={handleCreate}>Create Task</button>

      <hr />

      <h3>Task List</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong>

            <span className={getStatusClass(task.status)}>
              {task.status}
            </span>

            <div style={{ marginTop: "8px" }}>
              <button
                className="secondary"
                onClick={() =>
                  handleStatusChange(task.id, "IN_PROGRESS")
                }
              >
                In Progress
              </button>

              <button
                className="secondary"
                onClick={() =>
                  handleStatusChange(task.id, "DONE")
                }
              >
                Done
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
