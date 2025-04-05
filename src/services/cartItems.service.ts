import axios from "../axios";

export const removeCartItem = async (cartItemId: number | string) => {
  const response = await axios.delete(`/cart-items/${cartItemId}`);
  return response.data;
};

export const updateCartItem = async (
  cartItemId: number | string,
  quantity: number,
) => {
  const response = await axios.put(`/cart-items/${cartItemId}`, { quantity });
  return response.data;
};
