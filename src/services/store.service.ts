import axios from "../axios";
import { ICreateStore } from "../interface";

export const createStore = async (store: ICreateStore) => {
  const response = await axios.post("/sellers", store);
  return response.data;
};
