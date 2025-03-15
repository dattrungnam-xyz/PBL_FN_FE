export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  roles: Role[];
  createdAt: string;
}

export type Role = "admin" | "user" | "doctor";

export enum RoleEnum {
  Admin = "admin",
  User = "user",
  Doctor = "doctor",
}

export function canAccessAdminPage(user: User) {
  return (
    user.roles.includes(RoleEnum.Admin) 
  );
}

export function isAdmin(user: User) {
  return user.roles.includes(RoleEnum.Admin);
}

export function getRole(user: User) {
  if (user.roles.includes(RoleEnum.Admin)) {
    return RoleEnum.Admin;
  }
  if (user.roles.includes(RoleEnum.Doctor)) {
    return RoleEnum.Doctor;
  }
  return RoleEnum.User;
}
