import axios from "../axios";
import { ICreateStore, IStore } from "../interface";
import PaginatedData from "../types/PaginatedData";

export const createStore = async (store: ICreateStore) => {
  const response = await axios.post("/sellers/", store);
  return response.data;
};

export const getStore = async () => {
  const response = await axios.get(`/sellers/user/`);
  return response.data;
};

export const updateStore = async (store: ICreateStore) => {
  const response = await axios.put(`/sellers/`, store);
  return response.data;
};

export const getStores = async ({
  page = 1,
  limit = 10,
  search = "",
  province = "",
  district = "",
  ward = "",
}: {
  page: number;
  limit: number;
  search: string;
  province: string;
  district: string;
  ward: string;
}) => {
  const response = await axios.get<PaginatedData<IStore>>(`/sellers/`, {
    params: {
      page,
      limit,
      search,
      province,
      district,
      ward,
    },
  });
  return response.data;
};

export const getStoreById = async (id: string) => {
  const response = await axios.get<IStore>(`/sellers/${id}`);
  return response.data;
};
