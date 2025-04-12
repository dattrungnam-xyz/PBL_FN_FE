import { PaymentMethod, OrderStatus } from "../enums";
import { IPayment } from "./payment.interface";
import { IProduct } from "./product.interface";
import { IReview } from "./review.interface";
import { IStore } from "./store.interface";
import { IUser } from "./user.interface";
import { IAddress } from "./userAddress.interface";

export interface ICreateOrder {
  addressId: string;
  note: string;
  paymentMethod: PaymentMethod;
  sellerId: string;
  totalPrice: number;
  shippingFee: number;
  orderDetails: ICreateOrderDetail[];
}

export interface ICreateOrderDetail {
  productId: string;
  quantity: number;
}

export interface IOrder {
  id: string;
  orderStatus: OrderStatus;
  address: IAddress;
  createdAt: string;
  deletedAt: string | null;
  note: string;
  orderDetails: IOrderDetail[];
  payment: IPayment;
  seller: IStore;
  totalPrice: number;
  shippingFee: number;
  user: IUser;
  cancelReason: string | null;
  refundReason: string | null;
  refundReasonImage: string[];
  rejectReason: string | null;
}

export interface IOrderDetail {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  quantity: number;
  price: number;
  product: IProduct;
  review: IReview | null;
}

export interface IRefundRequest {
  refundReason: string;
  refundReasonImage: string[];
}

export interface ICancelRequest {
  cancelReason: string;
}
