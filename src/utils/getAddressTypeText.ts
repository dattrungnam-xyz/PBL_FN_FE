export const getAddressTypeText = (type: string) => {
  switch (type) {
    case "home":
      return "Nhà riêng";
    case "office":
      return "Văn phòng";
    case "other":
      return "Khác";
  }
};
