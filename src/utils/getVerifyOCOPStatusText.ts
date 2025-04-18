import { VerifyOCOPStatus } from "../enums";

export const getVerifyOCOPStatusText = (status: VerifyOCOPStatus) => {
  switch (status) {
    case VerifyOCOPStatus.VERIFIED:
      return "Đã xác thực";
    case VerifyOCOPStatus.REJECTED:
      return "Đã từ chối";
    case VerifyOCOPStatus.PENDING:
      return "Đang chờ";
    case VerifyOCOPStatus.NOT_SUBMITTED:
      return "Chưa nộp";
    default:
      return "Không xác định";
  }
};
