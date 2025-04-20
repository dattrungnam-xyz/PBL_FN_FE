import axios from "../axios";
import { IUser, IUserTable } from "../interface/user.interface";
import PaginatedData from "../types/PaginatedData";

export const getUserProfile = async (): Promise<IUser> => {
  const response = await axios.get("/users/profile");
  return response.data;
};

export const updateUserProfile = async (data: {
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}): Promise<IUser> => {
  const response = await axios.patch(`/users/updateProfile`, data);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}): Promise<void> => {
  await axios.patch("/auth/updatePassword", data);
};

export const getUsers = async ({
  page,
  limit,
  search,
  isActive,
}: {
  page: number;
  limit: number;
  search: string;
  isActive?: boolean;
}): Promise<PaginatedData<IUserTable>> => {
  const response = await axios.get("/users", {
    params: {
      page,
      limit,
      search,
      isActive: isActive === true ? undefined : false,
    },
  });
  return response.data;
};

export const getUserById = async (userId: string): Promise<IUser> => {
  const response = await axios.get(`/users/${userId}`);
  return response.data;
};

export const blockUser = async (userId: string): Promise<void> => {
  await axios.patch(`/users/active/${userId}`);
};

export const unblockUser = async (userId: string): Promise<void> => {
  await axios.patch(`/users/deactive/${userId}`);
};
