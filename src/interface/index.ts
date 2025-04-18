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
import { IAnalystic, IOrdersAnalystic } from "./common.interface";
import { ICreateReview, IReview } from "./review.interface";
import { IAnalysticByCategory } from "./revenue.interface";
import { ICustomerStatistic, ITopCustomer } from "./customer.interfact";
import { IReviewStatistic } from "./review.interface";
import { IRestocking } from "./restocking.interface";
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
  IAnalystic,
  ICreateReview,
  IReview,
  IOrdersAnalystic,
  IAnalysticByCategory,
  ICustomerStatistic,
  ITopCustomer,
  IReviewStatistic,
  IRestocking,
};
