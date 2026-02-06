import api from "./axios";

export const fetchTeams = () => {
  return api.get("/teams");
};

export const createTeam = (data) => {
  return api.post("/teams", data);
};

export const addMember = (teamId, userId) => {
  return api.post(`/teams/${teamId}/add-member/${userId}`);
};

export const fetchTeamMembers = (teamId) => {
  return api.get(`/teams/${teamId}/members`);
};
