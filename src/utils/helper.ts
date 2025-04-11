import { OrderStatus } from "../enums/orderStatus.enum";

export function file2Base64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function fileList2Base64(fileList: FileList): Promise<string> {
  return file2Base64(fileList[0]);
}

export function validateEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function getPhoneValidator(errorMessage?: string) {
  return {
    pattern: {
      value: /^[0-9]{10,11}$/,
      message: errorMessage || "Phone number must be 10 or 11 digits",
    },
  };
}

export const getOrderStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "Chờ xác nhận";
    case OrderStatus.PENDING_PAYMENT:
      return "Chờ thanh toán";
    case OrderStatus.PREPARING_FOR_SHIPPING:
      return "Chuẩn bị giao hàng";
    case OrderStatus.SHIPPING:
      return "Đang giao hàng";
    case OrderStatus.COMPLETED:
      return "Đã hoàn tất";
    case OrderStatus.CANCELLED:
      return "Đã hủy";
    case OrderStatus.REFUNDED:
      return "Đã hoàn tiền";
    case OrderStatus.REJECTED:
      return "Bị từ chối";
    case OrderStatus.REQUIRE_CANCEL:
      return "Yêu cầu hủy";
    case OrderStatus.REQUIRE_REFUND:
      return "Yêu cầu hoàn tiền";
  }
};
export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "warning";
    case OrderStatus.PENDING_PAYMENT:
      return "info";
    case OrderStatus.PREPARING_FOR_SHIPPING:
      return "primary";
    case OrderStatus.SHIPPING:
      return "success";
    case OrderStatus.COMPLETED:
      return "success";
    case OrderStatus.CANCELLED:
      return "error";
    case OrderStatus.REFUNDED:
      return "error";
    case OrderStatus.REJECTED:
      return "error";
    case OrderStatus.REQUIRE_CANCEL:
      return "error";
    case OrderStatus.REQUIRE_REFUND:
      return "error";
    default:
      return "default";
  }
};
