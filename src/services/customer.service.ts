import axios from "../axios";
import { IAnalystic, ICustomerStatistic, ITopCustomer } from "../interface";

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
