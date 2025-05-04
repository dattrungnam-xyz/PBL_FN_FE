import axios from "../axios";
import {
  IAnalystic,
  ICreateReview,
  IReview,
  IReviewStatistic,
} from "../interface";
import PaginatedData from "../types/PaginatedData";

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

export const getReviewStatistic = async (): Promise<IReviewStatistic> => {
  const response = await axios.get("/reviews/statistics/");
  return response.data;
};

export const getRecentReviews = async (): Promise<IReview[]> => {
  const response = await axios.get("/reviews/recent");
  return response.data;
};

export const getTopRecentReviews = async (): Promise<IReview[]> => {
  const response = await axios.get("/reviews/top-recent");
  return response.data;
};
interface IReviewParams {
  productId?: string;
  rating?: number;
  page?: number;
  limit?: number;
  search?: string;
}
export const getReviews = async (
  params: IReviewParams,
): Promise<PaginatedData<IReview>> => {
  const response = await axios.get("/reviews/seller", {
    params: {
      productId: params.productId === "All" ? undefined : params.productId,
      rating: params.rating,
      page: params.page,
      limit: params.limit,
      search: params.search,
    },
  });
  return response.data;
};

export const getReviewAverage = async () => {
  const response = await axios.get("/reviews/average");
  return response.data;
};
