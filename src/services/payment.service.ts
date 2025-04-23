import axios from "../axios";
import { PaymentMethod } from "../enums/paymentMethod.enum";
export const createZaloPayPaymentUrl = async ({
  orderId,
  amount,
  paymentMethod,
}: {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}) => {
  const response = await axios.post("/payments/zalopay", {
    orderId,
    amount,
    paymentMethod,
  });
  return response.data;
};
