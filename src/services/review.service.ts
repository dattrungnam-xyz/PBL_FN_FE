import axios from "../axios";
import { IAnalystic } from "../interface";

export const getReviewCount = async (
  type: "week" | "month" | "year",
): Promise<IAnalystic> => {
  const response = await axios.get("/reviews/analysis/review", {
    params: { type },
  });
  return response.data;
};
