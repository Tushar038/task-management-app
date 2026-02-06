import api from "./axios";

export const createTask = (data) =>
  api.post("/tasks/", data);

export const fetchTasks = () =>
  api.get("/tasks/");

export const updateTaskStatus = (taskId, data) =>
  api.patch(`/tasks/${taskId}/status`, data);
