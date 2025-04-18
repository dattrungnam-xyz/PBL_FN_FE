import axios from "../axios";

export const getStockingProducts = async ({
  productId,
  page,
  limit,
  search,
  category,
}: {
  productId: string;
  page: number;
  limit: number;
  search?: string;
  category?: string;
}) => {
  const response = await axios.get(`restocking/`, {
    params: {
      productId: productId === "all" ? undefined : productId,
      page,
      limit,
      search,
      category: category === "ALL" ? undefined : category,
    },
  });
  return response.data;
};
