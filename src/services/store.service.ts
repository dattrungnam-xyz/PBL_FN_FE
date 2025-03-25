import axios from "../axios";
import { ICreateStore } from "../interface";

export const createStore = async (store: ICreateStore) => {
  const response = await axios.post("/sellers", store);
  return response.data;
};

export const getStore = async () => {
  const response = await axios.get(`/sellers/user`);
  return response.data;
};

export const updateStore = async (store: ICreateStore) => {
  const response = await axios.put(`/sellers`, store);
  return response.data;
};
