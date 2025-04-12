import axios from "../axios";
import { IAnalystic } from "../interface";

export const getCustomerCount = async (
  type: "week" | "month" | "year",
): Promise<IAnalystic> => {
  const response = await axios.get("/orders/analysis/customer", {
    params: { type },
  });
  return response.data;
};
