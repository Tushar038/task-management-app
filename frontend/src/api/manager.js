import api from "./axios";

export const fetchManagerOverview = () => {
  return api.get("/manager/overview");
};

export const fetchManagerTeamTasks = (teamId) => {
  return api.get(`/manager/team/${teamId}/tasks`);
};
