import api from "./axios";
import { authHeader } from "./authHeader";

export const createTask = (data) =>
  api.post(
    "/tasks",
    data,
    { headers: authHeader() }
  );

export const fetchTasks = () =>
  api.get(
    "/tasks",
    { headers: authHeader() }
  );

export const updateTaskStatus = (taskId, status) =>
  api.patch(
    `/tasks/${taskId}/status`,
    { status },
    { headers: authHeader() }
  );
