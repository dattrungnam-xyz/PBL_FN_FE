import { IProduct } from "./product.interface";
import { IUser } from "./user.interface";

export interface IRestocking {
  id: string;
  quantity: number;
  createdAt: string;
  deletedAt: string;
  product: IProduct;
  user: IUser;
}
