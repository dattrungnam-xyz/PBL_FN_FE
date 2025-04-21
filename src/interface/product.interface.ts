import { Category, SellingProductStatus, VerifyOCOPStatus } from "../enums";
import { IOrderDetail } from "./order.interface";
import { IReview } from "./review.interface";
import { IVerify } from "./verify.interface";
interface ISellerRelation {
  id: string;
  name: string;
  avatar: string;
  wardName: string;
  districtName: string;
  provinceName: string;
  phone: string;
  address: string;
}

export interface ICreateProduct {
  name: string;
  description: string;
  category: Category;
  price: number;
  quantity: number;
  star: number;
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
  star: number;
  verifyOcopStatus: VerifyOCOPStatus;
  createdAt: string;
  deletedAt: string | null;
  avgRating?: number;
  reviewCount?: number;
  orderDetailCount?: number;
  totalRevenue?: number;
  seller: ISellerRelation;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  star: number;
  category: Category;
  status: SellingProductStatus;
  quantity: number;
  createdAt: string;
  deletedAt: string | null;
  images: string[];
  verifyOcopStatus: VerifyOCOPStatus;
  seller: ISellerRelation;
  reviews: IReview[];
  verify: IVerify[];
  orderDetails: IOrderDetail[];
  // relatedProducts: IProduct[];
}
