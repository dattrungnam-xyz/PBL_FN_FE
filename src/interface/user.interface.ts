import { IOrder } from "./order.interface";
import { IReview } from "./review.interface";
import { IStore } from "./store.interface";
import { IAddress } from "./userAddress.interface";

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isActive: boolean;
  username: string;
  addresses: IAddress[];
  reviews: IReview[];
  orders: IOrder[];
  seller: IStore;
}

export interface IUserTable extends IUser {
  orders: IOrder[];
  reviews: IReview[];
  roles: string[];
  seller: IStore;
}
