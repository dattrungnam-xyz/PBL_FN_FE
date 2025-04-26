import axios from "../axios";
import { OrderStatus } from "../enums";
import {
  IAnalystic,
  IAnalysticByCategory,
  ICancelRequest,
  ICreateOrder,
  IOrder,
  IOrdersAnalystic,
  IRefundRequest,
} from "../interface";
import PaginatedData from "../types/PaginatedData";

export interface OrderSellerFilter {
  page: number;
  limit: number;
  orderStatus?: OrderStatus;
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

export const requestRefundOrder = async (
  orderId: string,
  refundRequest: IRefundRequest,
) => {
  const response = await axios.patch(
    `/orders/${orderId}/request-refund`,
    refundRequest,
  );
  return response.data;
};

export const requestCancelOrder = async (
  orderId: string,
  cancelRequest: ICancelRequest,
) => {
  const response = await axios.patch(
    `/orders/${orderId}/request-cancel`,
    cancelRequest,
  );
  return response.data;
};

export const acceptRefundOrder = async (orderId: string) => {
  const response = await axios.patch(`/orders/${orderId}/accept-refund`);
  return response.data;
};

export const rejectRefundOrder = async (orderId: string, reason: string) => {
  const response = await axios.patch(`/orders/${orderId}/reject-refund`, {
    reason,
  });
  return response.data;
};

export const getRevenueAnalystic = async (
  type: "week" | "month" | "year",
): Promise<IAnalystic> => {
  const response = await axios.get("/orders/analysis/revenue", {
    params: {
      type,
    },
  });
  return response.data;
};

export const getOrdersAnalystic = async (
  type: "week" | "month" | "year",
): Promise<IOrdersAnalystic> => {
  const response = await axios.get("/orders/analysis/order", {
    params: { type },
  });
  return response.data;
};

export const getRevenueAnalysticByCategory = async (
  type: "week" | "month" | "year",
): Promise<IAnalysticByCategory[]> => {
  const response = await axios.get("/orders/analysis/revenue-by-category", {
    params: {
      type,
    },
  });
  return response.data;
};

export const getRevenueFiveMonth = async () => {
  const response = await axios.get("/orders/analysis/revenue-five-month");
  return response.data;
};

export const getListOrders = async (
  filters: OrderSellerFilter,
): Promise<PaginatedData<IOrder>> => {
  const response = await axios.get("/orders/list", {
    params: {
      page: filters.page || 1,
      limit: filters.limit || 15,
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

export const getAdminRevenue = async () => {
  const response = await axios.get("/orders/revenue");
  return response.data;
};
