export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  roles: Role[];
  createdAt: string;
  storeId?: string;
}

export type Role = "admin" | "user" | "seller";

export enum RoleEnum {
  Admin = "admin",
  User = "user",
  Seller = "seller",
}

export function isSeller(user: User) {
  if (user.roles.includes(RoleEnum.Seller)) {
    return true;
  }
  return false;
}

export function canAccessAdminPage(user: User) {
  return user.roles.includes(RoleEnum.Admin);
}

export function isAdmin(user: User) {
  return user.roles.includes(RoleEnum.Admin);
}

export function getRole(user: User) {
  if (user.roles.includes(RoleEnum.Admin)) {
    return RoleEnum.Admin;
  }
  if (user.roles.includes(RoleEnum.Seller)) {
    return RoleEnum.Seller;
  }
  return RoleEnum.User;
}
