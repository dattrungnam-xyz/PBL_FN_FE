import axios from "../axios";
import { ICreateUserAddress, IUserAddress } from "../interface";

export const getUserAddresses = async () => {
  const response = await axios.get<IUserAddress[]>("/user-address");
  return response.data;
};

export const createUserAddress = async (data: ICreateUserAddress) => {
  const response = await axios.post("/user-address", data);
  return response.data;
};

export const deleteUserAddress = async (id: string) => {
  const response = await axios.delete(`/user-address/${id}`);
  return response.data;
};

export const updateUserAddress = async (data: IUserAddress) => {
  const response = await axios.put(`/user-address/${data.id}`, data);
  return response.data;
};
