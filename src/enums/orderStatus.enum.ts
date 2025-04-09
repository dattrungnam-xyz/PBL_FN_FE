export enum OrderStatus {
  PENDING_PAYMENT = "pending_payment",
  PENDING = "pending",
  PREPARING_FOR_SHIPPING = "preparing_for_shipping",
  SHIPPING = "shipping",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  REJECTED = "rejected",
  ALL = "all",
  REQUIRE_CANCEL = "require_cancel",
  REQUIRE_REFUND = "require_refund",
}
