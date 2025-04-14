import axios from "../axios";
import { SellingProductStatus, VerifyOCOPStatus } from "../enums";
import { Category } from "../enums";
import { ICreateProduct } from "../interface";
import { IProductTableData } from "../interface/product.interface";
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
  const response = await axios.get(`/products/${id}`);
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
  const response = await axios.get(`/products/seller/top-trending?type=${type}`);
  return response.data;
};
