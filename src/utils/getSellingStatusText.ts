import { SellingProductStatus } from "../enums/sellingProduct.enum";

export const getSellingStatusText = (status: SellingProductStatus) => {
  switch (status) {
    case SellingProductStatus.SELLING:
      return "Đang bán";
    case SellingProductStatus.STOPPED:
      return "Ngừng bán";
  }
};
