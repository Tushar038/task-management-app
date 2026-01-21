import api from "./axios";
import { authHeader } from "./authHeader";

export const createTeam = (name) =>
  api.post(
    "/teams",
    { name },
    { headers: authHeader() }
  );

export const fetchTeams = () =>
  api.get(
    "/teams",
    { headers: authHeader() }
  );
