import api from "./axios";

export const fetchAdminOverview = () => {
  return api.get("/admin/overview");
};

export const fetchUserRolesStats = () => {
  return api.get("/admin/users/roles");
};
