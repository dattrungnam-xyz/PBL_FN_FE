import axios from "../axios";
import { SellingProductStatus, VerifyOCOPStatus } from "../enums";
import { Category } from "../enums";
import { ICreateProduct } from "../interface";
import { IProduct, IProductTableData } from "../interface/product.interface";
import PaginatedData from "../types/PaginatedData";

interface GetProductByStoreIdParams {
  page?: number;
  limit?: number;
  category?: Category;
  status?: SellingProductStatus;
  search?: string;
  verifyStatus?: VerifyOCOPStatus;
}

export const createProduct = async (product: ICreateProduct) => {
  const response = await axios.post("/products/", product);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await axios.get<IProduct>(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (id: string, product: ICreateProduct) => {
  const response = await axios.put(`/products/${id}`, product);
  return response.data;
};

export const getProductByStoreId = async (
  storeId: string | undefined,
  filters: GetProductByStoreIdParams,
) => {
  const response = await axios.get<PaginatedData<IProductTableData>>(
    `/products/seller/${storeId ?? ""}`,
    {
      params: {
        page: filters.page || 1,
        limit: filters.limit || 15,
        category:
          filters.category === Category.ALL ? undefined : filters.category,
        status:
          filters.status === SellingProductStatus.ALL
            ? undefined
            : filters.status,
        search: filters.search,
        verifyStatus:
          filters.verifyStatus === VerifyOCOPStatus.ALL
            ? undefined
            : filters.verifyStatus,
      },
    },
  );
  return response.data;
};

export const getTopProduct = async (
  type: "week" | "month" | "year",
): Promise<IProductTableData[]> => {
  const response = await axios.get(`/products/seller/top-rating?type=${type}`);
  return response.data;
};

export const getTrendProduct = async (
  type: "week" | "month" | "year",
): Promise<IProductTableData[]> => {
  const response = await axios.get(
    `/products/seller/top-trending?type=${type}`,
  );
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`/products/${id}`);
  return response.data;
};

export const updateProductQuantity = async (id: string, quantity: number) => {
  const response = await axios.patch(`/products/${id}/quantity`, { quantity });
  return response.data;
};

export const getProductCountCategory = async (sellerId?: string) => {
  const response = await axios.get(`/products/count/category`, {
    params: {
      sellerId,
    },
  });
  return response.data;
};

export const getRelativeProducts = async (productId: string) => {
  const response = await axios.get(`/products/${productId}/relative`);
  return response.data;
};

export const getProducts = async (filters: {
  page?: number;
  limit?: number;
  categories?: Category[];
  provinces?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  userId?: string;
  viewHistory?: string[];
  searchHistory?: string[];
}) => {
  const response = await axios.get<PaginatedData<IProduct>>("/products", {
    params: {
      page: filters.page || 1,
      limit: filters.limit || 15,
      categories: filters.categories ? filters.categories.join(",") : undefined,
      provinces: filters.provinces ? filters.provinces.join(",") : undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      search: filters.search,
      userId: filters.userId,
      viewHistory: filters.viewHistory
        ? filters.viewHistory.join(",")
        : undefined,
      searchHistory: filters.searchHistory
        ? filters.searchHistory.join(",")
        : undefined,
    },
  });
  return response.data;
};

export const getRelatedProducts = async (id: string) => {
  const response = await axios.get(`/products/similar/${id}`);
  return response.data;
};

export const getFiveStarProduct = async () => {
  const response = await axios.get<IProduct[]>(`/products/five-star`);
  return response.data;
};

export const getPopularProduct = async () => {
  const response =
    await axios.get<PaginatedData<IProduct>>(`/products/popular`);
  return response.data.data;
};
