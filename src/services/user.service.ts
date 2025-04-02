import axios from "../axios";
import { IUser } from "../interface/user.interface";

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
