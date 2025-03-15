import { User } from "../../../types/auth";

export default interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}
