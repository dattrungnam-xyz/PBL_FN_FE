import { IProduct } from "./product.interface";
import { IStore } from "./store.interface";

interface ICartItem {
  id: number;
  quantity: number;
  product: IProduct;
}

export interface ICartGroupByStore {
  items: ICartItem[];
  seller: IStore;
}
