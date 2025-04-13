import { IOrderDetail } from "./order.interface";
import { IProduct } from "./product.interface";
import { IUser } from "./user.interface";

export interface ICreateReview {
  rating: number;
  description: string;
  media: string[];
  orderDetailId: string;
}

export interface IReview {
  id: string;
  rating: number;
  description: string;
  media: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: IUser;
  product: IProduct;
  orderDetail?: IOrderDetail;
}

export interface IReviewStatistic {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}
