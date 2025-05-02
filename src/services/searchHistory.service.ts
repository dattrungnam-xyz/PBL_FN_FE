import axios from "../axios";

export const createSearchHistory = async (searchHistory: string[]) => {
  const response = await axios.post("/search-history", {
    search:  searchHistory,
  });
  return response.data;
};

export const createViewHistory = async (viewHistory: string[]) => {
  const response = await axios.post("/users/create-view-history", {
    productIds: viewHistory,
  });
  return response.data;
};
