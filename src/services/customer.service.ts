import axios from "../axios";
import {
  IAnalystic,
  ICustomerCountGroupByProvince,
  ICustomerStatistic,
  ITopCustomer,
} from "../interface";
import { IUser } from "../interface/user.interface";
import PaginatedData from "../types/PaginatedData";

export const getCustomerCount = async (
  type: "week" | "month" | "year",
): Promise<IAnalystic> => {
  const response = await axios.get("/orders/analysis/customer", {
    params: { type },
  });
  return response.data;
};

export const getCustomerStatistic = async (): Promise<ICustomerStatistic> => {
  const response = await axios.get("/orders/customers/statistics");
  return response.data;
};

export const getTopCustomers = async (): Promise<ITopCustomer[]> => {
  const response = await axios.get("/users/top-customers/");
  return response.data;
};

export const getCustomerCountGroupByProvince = async (): Promise<
  ICustomerCountGroupByProvince[]
> => {
  const response = await axios.get("/users/count-by-province");
  return response.data;
};

export const getCustomersOfStore = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}): Promise<PaginatedData<IUser>> => {
  const response = await axios.get("/users/customers", {
    params: { page, limit, search },
  });
  return response.data;
};
