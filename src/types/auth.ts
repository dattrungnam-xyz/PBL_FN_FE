export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string | null;
  roles: Role[];
  createdAt: string;
}

export type Role = "admin" | "user" | "doctor";

export enum RoleEnum {
  Admin = "admin",
  User = "user",
  Doctor = "doctor",
}
