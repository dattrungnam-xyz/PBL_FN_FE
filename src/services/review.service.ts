import axios from "../axios";
import { IAnalystic, ICreateReview } from "../interface";

export const getReviewCount = async (
  type: "week" | "month" | "year",
): Promise<IAnalystic> => {
  const response = await axios.get("/reviews/analysis/review", {
    params: { type },
  });
  return response.data;
};

export const createReview = async (review: ICreateReview) => {
  const response = await axios.post("/reviews", review);
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await axios.delete(`/reviews/${reviewId}`);
  return response.data;
};
