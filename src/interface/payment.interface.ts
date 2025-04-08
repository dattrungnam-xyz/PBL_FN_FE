import { PaymentMethod, PaymentStatus } from "../enums";

export interface IPayment {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string | null;
}
