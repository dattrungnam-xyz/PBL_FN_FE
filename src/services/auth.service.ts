import axios from "../axios";
import { User } from "../types/auth";

export const me = async (token: string): Promise<User> => {
  const response = await axios.get<User>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
