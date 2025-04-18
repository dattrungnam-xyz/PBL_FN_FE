export enum OrderStatus {
  ALL = "all",
  PENDING_PAYMENT = "pending_payment",
  PENDING = "pending",
  PREPARING_FOR_SHIPPING = "preparing_for_shipping",
  SHIPPING = "shipping",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  REJECTED = "rejected",
  REQUIRE_CANCEL = "require_cancel",
  REQUIRE_REFUND = "require_refund",
}
