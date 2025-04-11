import { IProvince, IDistrict, IWard } from "./location.interface";
import { ICreateStore, ICreateStoreError, IStore } from "./store.interface";
import {
  ICreateProduct,
  ICreateProductError,
  IProduct,
} from "./product.interface";
import { ICreateVerify, IVerifyResponse, IVerify } from "./verify.interface";
import { ICreateUserAddress, IUserAddress } from "./userAddress.interface";
import { ICartGroupByStore } from "./cart.interface";
import {
  ICreateOrder,
  ICreateOrderDetail,
  IOrder,
  IOrderDetail,
  IRefundRequest,
  ICancelRequest,
} from "./order.interface";
import { IAddress } from "./userAddress.interface";

export type {
  IProvince,
  IDistrict,
  IWard,
  ICreateStore,
  ICreateStoreError,
  ICreateProduct,
  ICreateProductError,
  ICreateVerify,
  IVerifyResponse,
  ICreateUserAddress,
  IUserAddress,
  IProduct,
  IStore,
  IVerify,
  ICartGroupByStore,
  ICreateOrder,
  ICreateOrderDetail,
  IOrder,
  IOrderDetail,
  IAddress,
  IRefundRequest,
  ICancelRequest,
};
