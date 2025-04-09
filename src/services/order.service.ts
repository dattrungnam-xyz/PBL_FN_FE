import axios from "../axios";
import { OrderStatus } from "../enums";
import { ICreateOrder, IOrder } from "../interface";
import PaginatedData from "../types/PaginatedData";

export interface OrderSellerFilter {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
  search?: string;
  province?: string;
  district?: string;
  ward?: string;
  startDate?: string;
  endDate?: string;
}

export const createOrders = async (orders: ICreateOrder[]) => {
  const response = await axios.post("/orders", orders);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await axios.get("/orders");
  return response.data;
};

export const getOrdersSellerByStatus = async (
  filters: OrderSellerFilter,
): Promise<PaginatedData<IOrder>> => {
  console.log(filters);
  const response = await axios.get<PaginatedData<IOrder>>("/orders/seller", {
    params: {
      page: filters.page || 1,
      limit: filters.limit || 15,
      orderStatus:
        filters.orderStatus === OrderStatus.ALL
          ? undefined
          : filters.orderStatus,
      search: filters.search,
      province: filters.province === "all" ? undefined : filters.province,
      district: filters.district === "all" ? undefined : filters.district,
      ward: filters.ward === "all" ? undefined : filters.ward,
      startDate: filters.startDate,
      endDate: filters.endDate,
    },
  });
  return response.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
) => {
  const response = await axios.patch(`/orders/${orderId}/status`, {
    status,
  });
  return response.data;
};

export const updateOrdersStatus = async (
  orderIds: string[],
  status: OrderStatus,
) => {
  const response = await axios.patch(`/orders/status`, {
    orderIds,
    status,
  });
  return response.data;
};

export const rejectOrder = async (orderId: string, reason: string) => {
  const response = await axios.patch(`/orders/${orderId}/reject`, {
    reason,
  });
  return response.data;
};
