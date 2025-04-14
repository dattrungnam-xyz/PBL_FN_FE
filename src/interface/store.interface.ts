import { IOrder } from "./order.interface";
import { IProduct } from "./product.interface";
import { IUser } from "./user.interface";

export interface ICreateStore {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  avatar: string;
  banner: string;
}

export type ICreateStoreError = Partial<Record<keyof ICreateStore, string>>;

export interface IStore {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  avatar: string;
  banner: string;
  user: IUser;
  products: IProduct[];
  orders: IOrder[];
  createdAt: string;
}
