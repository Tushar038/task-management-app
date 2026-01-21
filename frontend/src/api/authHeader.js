import { getToken } from "../utils/auth";

export const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});
