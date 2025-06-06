import axios from "../axios";
import { ICartGroupByStore } from "../interface";

export const addToCart = async (productId: string, quantity: number) => {
  const response = await axios.post("/carts/", {
    productId,
    quantity,
  });
  return response.data;
};

export const getCart = async (): Promise<ICartGroupByStore[]> => {
  const response = await axios.get<ICartGroupByStore[]>("/carts/");
  return response.data;
};

export const getCartCheckOut = async (
  selectedItems: (number | string)[],
): Promise<ICartGroupByStore[]> => {
  const response = await axios.post<ICartGroupByStore[]>("/carts/checkout", {
    selectedItems,
  });
  return response.data;
};
