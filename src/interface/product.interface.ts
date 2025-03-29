import { Category, SellingProductStatus, VerifyOCOPStatus } from "../enums";

export interface ICreateProduct {
  name: string;
  description: string;
  category: Category;
  price: string;
  quantity: string;
  status: SellingProductStatus;
  images: string[];
}

export type ICreateProductError = Partial<Record<keyof ICreateProduct, string>>;

export interface IProductTableData {
  id: string;
  category: Category;
  name: string;
  price: number;
  quantity: number;
  status: SellingProductStatus;
  images: string[];
  description: string;
  verifyOcopStatus: VerifyOCOPStatus;
  createdAt: string;
  deletedAt: string | null;
}
