import { VerifyOCOPStatus } from "../enums";
import { IProductTableData } from "./product.interface";

export interface ICreateVerify {
  star: number;
  productName: string;
  manufacturer: string;
  verifyDate: string;
  images: string[];
  productIds: string[];
}

export interface IVerifyResponse {
  id: string;
  status: VerifyOCOPStatus;
  star: number;
  productName: string;
  manufacturer: string;
  verifyDate: string;
  images: string[];
  createdAt: string;
  deletedAt: string | null;
  products: IProductTableData[];
}

export interface IVerifyTableData {
  id: string;
  status: VerifyOCOPStatus;
  star: number;
  productName: string;
  manufacturer: string;
  verifyDate: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  products: IProductTableData[];
}
