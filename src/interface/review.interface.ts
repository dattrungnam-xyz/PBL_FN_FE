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
}