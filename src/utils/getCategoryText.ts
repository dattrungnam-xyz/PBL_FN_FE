import { Category } from "../enums/category.enum";

export const getCategoryText = (category: Category) => {
  switch (category) {
    case Category.FOOD:
      return "Thực phẩm";
    case Category.BEVERAGE:
      return "Đồ uống";
    case Category.HERB:
      return "Thảo dược";
    case Category.HANDICRAFTS_DECORATION:
      return "Đồ trang trí";
  }
};
