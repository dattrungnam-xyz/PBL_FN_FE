import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
  Chip,
  Button,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { Content } from "../../layouts";
import { useEffect, useState } from "react";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import {
  getUserOrders,
  requestCancelOrder,
  requestRefundOrder,
  updateOrderStatus,
} from "../../services/order.service";
import {
  ICancelRequest,
  ICreateReview,
  IOrder,
  IOrderDetail,
  IRefundRequest,
} from "../../interface";
import { OrderStatus, PaymentMethod } from "../../enums";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReviewModal from "./component/ReviewModal";
import RefundModal from "./component/RefundModal";
import CancelModal from "./component/CancelModal";
import OrderDetailModal from "./component/OrderDetailModal";
import CustomBackdrop from "../../components/UI/CustomBackdrop";
import { createReview, deleteReview } from "../../services/review.service";
import ViewReviewModal from "./component/ViewReviewModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createZaloPayPaymentUrl } from "../../services/payment.service";

const orderStatuses = {
  pending_payment: {
    label: "Chờ thanh toán",
    color: "warning",
    icon: <PaymentOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  pending: {
    label: "Chờ xác nhận",
    color: "info",
    icon: <HourglassEmptyIcon sx={{ fontSize: "1rem" }} />,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "info",
    icon: <CheckCircleIcon sx={{ fontSize: "1rem" }} />,
  },
  preparing_for_shipping: {
    label: "Đang chuẩn bị",
    color: "info",
    icon: <InventoryOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  shipping: {
    label: "Đang giao hàng",
    color: "info",
    icon: <LocalShippingIcon sx={{ fontSize: "1rem" }} />,
  },
  completed: {
    label: "Hoàn thành",
    color: "success",
    icon: <CheckCircleOutlineIcon sx={{ fontSize: "1rem" }} />,
  },
  require_cancel: {
    label: "Yêu cầu hủy",
    color: "error",
    icon: <DoNotDisturbIcon sx={{ fontSize: "1rem" }} />,
  },
  cancelled: {
    label: "Đã hủy",
    color: "error",
    icon: <CancelOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  require_refund: {
    label: "Yêu cầu trả hàng",
    color: "error",
    icon: <ReceiptIcon sx={{ fontSize: "1rem" }} />,
  },
  refunded: {
    label: "Đã hoàn tiền",
    color: "error",
    icon: <AssignmentReturnOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  rejected: {
    label: "Bị từ chối",
    color: "error",
    icon: <DoNotDisturbIcon sx={{ fontSize: "1rem" }} />,
  },
} as const;

// Order status chip component
const StatusChip = ({ status }: { status: OrderStatus }) => {
  const statusConfig = orderStatuses[status as keyof typeof orderStatuses];
  return (
    <Chip
      icon={statusConfig.icon}
      label={statusConfig.label}
      size="small"
      color={statusConfig.color as "warning" | "info" | "success" | "error"}
      sx={{
        height: 24,
        "& .MuiChip-icon": {
          marginLeft: 1,
        },
      }}
    />
  );
};

const Orders = () => {
  const [tabValue, setTabValue] = useState("0");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] =
    useState<IOrderDetail | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const getOrders = async () => {
    try {
      setLoading(true);
      const orders = await getUserOrders();
      setOrders(orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // Filter orders based on tab
  const getFilteredOrders = (status?: OrderStatus) => {
    if (!orders) return [];
    if (!status) return orders;
    return orders.filter((order: IOrder) => order.orderStatus === status);
  };
  const handleOpenReviewModal = (order: IOrder, orderDetail: IOrderDetail) => {
    setSelectedOrder(order);
    setSelectedOrderDetail(orderDetail);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setSelectedOrder(null);
    setSelectedOrderDetail(null);
    setIsReviewModalOpen(false);
  };

  const handleReviewSubmit = async (review: ICreateReview) => {
    if (!selectedOrderDetail) return;
    try {
      setLoading(true);
      await createReview(review);
      await getOrders();
      toast.success("Đã đánh giá sản phẩm thành công");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };
  const handleOpenRefundModal = (order: IOrder) => {
    setSelectedOrder(order);
    setIsRefundModalOpen(true);
  };

  const handleCloseRefundModal = () => {
    setSelectedOrder(null);
    setIsRefundModalOpen(false);
  };

  const handleRefundRequest = async (refundRequest: IRefundRequest) => {
    if (!selectedOrder) return;
    try {
      setLoading(true);
      await requestRefundOrder(selectedOrder.id!, refundRequest);
      await getOrders();
      toast.success("Đã gửi yêu cầu trả hàng");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCancelModal = (order: IOrder) => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setSelectedOrder(null);
    setIsCancelModalOpen(false);
  };

  const handleCancelRequest = async (cancelRequest: ICancelRequest) => {
    if (!selectedOrder) return;
    try {
      setLoading(true);
      await requestCancelOrder(selectedOrder.id!, cancelRequest);
      await getOrders();
      toast.success("Đã yêu cầu hủy đơn hàng thành công");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOrderDetailModal = (order: IOrder) => {
    setSelectedOrder(order);
    setIsOrderDetailModalOpen(true);
  };

  const handleCloseOrderDetailModal = () => {
    setSelectedOrder(null);
    setIsOrderDetailModalOpen(false);
  };

  const handleOpenViewReviewModal = (
    order: IOrder,
    orderDetail: IOrderDetail,
  ) => {
    setSelectedOrder(order);
    setSelectedOrderDetail(orderDetail);
    setIsViewReviewModalOpen(true);
  };

  const handleCloseViewReviewModal = () => {
    setSelectedOrder(null);
    setSelectedOrderDetail(null);
    setIsViewReviewModalOpen(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      setLoading(true);
      await deleteReview(reviewId);
      await getOrders();
      setIsViewReviewModalOpen(false);
      toast.success("Đã xóa đánh giá thành công");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handlePayOrder = async (order: IOrder) => {
    try {
      const zaloOrder = {
        orderId: order.id,
        amount: order.totalPrice,
        paymentMethod: PaymentMethod.ZALOPAY,
      };
      const response = await createZaloPayPaymentUrl(zaloOrder);
      toast.success("Đặt hàng thành công");
      const redirectUrl = response.order_url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast.error("Redirect URL not received from server");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const OrderItem = ({ order }: { order: IOrder }) => {
    const handleUpdateOrderStatus = async (status: OrderStatus) => {
      try {
        await updateOrderStatus(order.id, status);
        getOrders();
      } catch (error) {
        console.error(error);
      }
    };
    const renderActionButtons = () => {
      switch (order.orderStatus) {
        case OrderStatus.PENDING_PAYMENT:
          return (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                color="error"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenCancelModal(order)}
              >
                Hủy đơn
              </Button>
              <Button
                variant="contained"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handlePayOrder(order)}
              >
                Thanh toán
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenOrderDetailModal(order)}
              >
                Chi tiết đơn hàng
              </Button>
            </Stack>
          );
        case OrderStatus.PENDING:
          return (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                color="error"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenCancelModal(order)}
              >
                Hủy đơn
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenOrderDetailModal(order)}
              >
                Chi tiết đơn hàng
              </Button>
            </Stack>
          );

        case OrderStatus.SHIPPING:
          return (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                size="small"
                color="success"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleUpdateOrderStatus(OrderStatus.COMPLETED)}
              >
                Đã nhận hàng
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenOrderDetailModal(order)}
              >
                Chi tiết đơn hàng
              </Button>
            </Stack>
          );
        case OrderStatus.COMPLETED:
          return (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
              >
                Mua lại
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenRefundModal(order)}
              >
                Yêu cầu trả hàng
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenOrderDetailModal(order)}
              >
                Chi tiết đơn hàng
              </Button>
            </Stack>
          );
        case OrderStatus.REQUIRE_CANCEL:
          return (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenOrderDetailModal(order)}
              >
                Chi tiết đơn hàng
              </Button>
            </Stack>
          );
        case OrderStatus.CANCELLED:
          return (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
              >
                Mua lại
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenOrderDetailModal(order)}
              >
                Chi tiết đơn hàng
              </Button>
            </Stack>
          );
        case OrderStatus.REQUIRE_REFUND:
          return (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                color="error"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenOrderDetailModal(order)}
              >
                Chi tiết yêu cầu trả hàng
              </Button>
            </Stack>
          );
        case OrderStatus.REFUNDED:
          return (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                color="info"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenOrderDetailModal(order)}
              >
                Chi tiết trả hàng
              </Button>
            </Stack>
          );
        case OrderStatus.REJECTED:
          return (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
              >
                Mua lại
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenOrderDetailModal(order)}
              >
                Chi tiết đơn hàng
              </Button>
            </Stack>
          );
        default:
          return (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: "0.813rem" }}
                onClick={() => handleOpenOrderDetailModal(order)}
              >
                Chi tiết đơn hàng
              </Button>
            </Stack>
          );
      }
    };

    return (
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          mb: 1.5,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        {/* Order Header */}
        <Box
          sx={{
            p: { xs: 0.5, sm: 1 },
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: 600,
              }}
            >
              {order.seller.name}
            </Typography>
            <StatusChip status={order.orderStatus} />
          </Box>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.813rem" },
              whiteSpace: "nowrap",
            }}
          >
            Đơn hàng: {order.id}
          </Typography>
        </Box>

        {/* Order Items */}
        <Stack divider={<Divider />}>
          {order.orderDetails.map((item) => (
            <Box
              key={item.id}
              sx={{
                p: { xs: 0.5, sm: 1 },
                display: "flex",
                gap: 1,
                alignItems: "center",
                bgcolor: "background.paper",
              }}
            >
              <Avatar
                variant="square"
                src={item.product.images[0]}
                alt={item.product.name}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "grey.100",
                  fontSize: "0.875rem",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(`/product/${item.product.id}`, {
                    state: { product: item.product },
                  })
                }
              >
                S
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: "0.938rem", sm: "1.125rem" },
                    fontWeight: 500,
                    mb: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.product.name}
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.813rem" },
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <span>{item.price.toLocaleString()}đ</span>
                    <span>×</span>
                    <span>{item.quantity}</span>
                  </Typography>
                  {order.orderStatus === OrderStatus.COMPLETED &&
                  !item.review ? (
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      sx={{
                        fontSize: "0.813rem",
                        minWidth: "unset",
                        width: "fit-content",
                        height: 24,
                        px: 1,
                      }}
                      onClick={() => handleOpenReviewModal(order, item)}
                    >
                      Đánh giá
                    </Button>
                  ) : null}
                  {order.orderStatus === OrderStatus.COMPLETED &&
                  item.review ? (
                    <Button
                      variant="outlined"
                      size="small"
                      color="info"
                      sx={{
                        fontSize: "0.813rem",
                        minWidth: "unset",
                        width: "fit-content",
                        height: 24,
                        px: 1,
                      }}
                      onClick={() => handleOpenViewReviewModal(order, item)}
                    >
                      Xem đánh giá
                    </Button>
                  ) : null}
                </Box>
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  fontWeight: 600,
                  color: "primary.main",
                  minWidth: "fit-content",
                }}
              >
                {(item.price * item.quantity).toLocaleString()}đ
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Order Footer */}
        <Box
          sx={{
            p: { xs: 0.5, sm: 1 },
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.813rem" },
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: "0.75rem" }} />
              {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.813rem" },
                    color: "text.secondary",
                  }}
                >
                  Phí vận chuyển:
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.813rem" },
                    color: "text.secondary",
                  }}
                >
                  {order.shippingFee.toLocaleString()}đ
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.813rem" },
                    color: "text.secondary",
                  }}
                >
                  Tổng tiền:
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.875rem", sm: "0.938rem" },
                    fontWeight: 600,
                    color: "primary.main",
                  }}
                >
                  {order.totalPrice.toLocaleString()}đ
                </Typography>
              </Box>
            </Box>
          </Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              "& .MuiButton-root": {
                minWidth: { xs: "auto", sm: 90 },
                px: { xs: 1, sm: 1.5 },
                fontSize: { xs: "0.75rem", sm: "0.813rem" },
                height: { xs: 28, sm: 32 },
                borderRadius: 1,
              },
            }}
          >
            {renderActionButtons()}
          </Stack>
        </Box>
      </Paper>
    );
  };

  return (
    <>
      {loading && <CustomBackdrop />}
      <Content>
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              maxWidth: 1200,
              width: "100%",
              mx: "auto",
              px: { xs: 1, sm: 2 },
              py: { xs: 1, sm: 2 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Page Title */}
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                fontWeight: 600,
                mb: { xs: 1, sm: 2 },
              }}
            >
              Đơn hàng của tôi
            </Typography>

            {/* Main Content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                flex: 1,
                overflow: "hidden",
                gap: 2,
              }}
            >
              {/* Tabs */}
              <TabContext value={tabValue}>
                <Box
                  sx={{
                    borderColor: "divider",
                    width: { xs: "100%", md: 200 },
                    flexShrink: 0,
                  }}
                >
                  <Tabs
                    orientation={isMobile ? "horizontal" : "vertical"}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="order status tabs"
                    sx={{
                      "& .MuiTab-root": {
                        fontSize: { xs: "0.875rem", sm: "0.938rem" },
                        minHeight: { xs: 40, sm: 48 },
                        px: { xs: 1.5, sm: 2 },
                        alignItems: "flex-start",
                        textAlign: "left",
                      },
                      "& .MuiTabs-indicator": {
                        left: { md: 0 },
                      },
                    }}
                  >
                    <Tab label="Tất cả" value="0" />
                    <Tab label="Chờ thanh toán" value="1" />
                    <Tab label="Chờ xác nhận" value="2" />
                    <Tab label="Đang chuẩn bị" value="3" />
                    <Tab label="Vận chuyển" value="4" />
                    <Tab label="Hoàn thành" value="5" />
                    <Tab label="Yêu cầu hủy" value="6" />
                    <Tab label="Đã hủy" value="7" />
                    <Tab label="Yêu cầu trả hàng" value="8" />
                    <Tab label="Đã hoàn tiền" value="9" />
                    <Tab label="Đã từ chối" value="10" />
                  </Tabs>
                </Box>

                {/* Tab Panels */}
                <Box
                  sx={{
                    flex: 1,
                    overflow: "hidden",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <TabPanel
                    value="0"
                    sx={{
                      height: "100%",
                      p: { xs: 0.5, sm: 1 },
                      overflow: "auto",
                    }}
                  >
                    <Stack spacing={1.5} sx={{ pb: 2 }}>
                      {getFilteredOrders().map((order: IOrder) => (
                        <OrderItem key={order.id} order={order} />
                      ))}
                    </Stack>
                  </TabPanel>
                  <TabPanel
                    value="1"
                    sx={{
                      height: "100%",
                      p: { xs: 0.5, sm: 1 },
                      overflow: "auto",
                    }}
                  >
                    <Stack spacing={1.5}>
                      {getFilteredOrders(OrderStatus.PENDING_PAYMENT).map(
                        (order: IOrder) => (
                          <OrderItem key={order.id} order={order} />
                        ),
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel
                    value="2"
                    sx={{
                      height: "100%",
                      p: { xs: 0.5, sm: 1 },
                      overflow: "auto",
                    }}
                  >
                    <Stack spacing={1.5}>
                      {getFilteredOrders(OrderStatus.PENDING).map(
                        (order: IOrder) => (
                          <OrderItem key={order.id} order={order} />
                        ),
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel
                    value="3"
                    sx={{
                      height: "100%",
                      p: { xs: 0.5, sm: 1 },
                      overflow: "auto",
                    }}
                  >
                    <Stack spacing={1.5}>
                      {getFilteredOrders(
                        OrderStatus.PREPARING_FOR_SHIPPING,
                      ).map((order: IOrder) => (
                        <OrderItem key={order.id} order={order} />
                      ))}
                    </Stack>
                  </TabPanel>
                  <TabPanel
                    value="4"
                    sx={{
                      height: "100%",
                      p: { xs: 0.5, sm: 1 },
                      overflow: "auto",
                    }}
                  >
                    <Stack spacing={1.5}>
                      {getFilteredOrders(OrderStatus.SHIPPING).map(
                        (order: IOrder) => (
                          <OrderItem key={order.id} order={order} />
                        ),
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel
                    value="5"
                    sx={{
                      height: "100%",
                      p: { xs: 0.5, sm: 1 },
                      overflow: "auto",
                    }}
                  >
                    <Stack spacing={1.5}>
                      {getFilteredOrders(OrderStatus.COMPLETED).map(
                        (order: IOrder) => (
                          <OrderItem key={order.id} order={order} />
                        ),
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel
                    value="6"
                    sx={{
                      height: "100%",
                      p: { xs: 0.5, sm: 1 },
                      overflow: "auto",
                    }}
                  >
                    <Stack spacing={1.5}>
                      {getFilteredOrders(OrderStatus.REQUIRE_CANCEL).map(
                        (order: IOrder) => (
                          <OrderItem key={order.id} order={order} />
                        ),
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel
                    value="7"
                    sx={{
                      height: "100%",
                      p: { xs: 0.5, sm: 1 },
                      overflow: "auto",
                    }}
                  >
                    <Stack spacing={1.5}>
                      {getFilteredOrders(OrderStatus.CANCELLED).map(
                        (order: IOrder) => (
                          <OrderItem key={order.id} order={order} />
                        ),
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel
                    value="8"
                    sx={{
                      height: "100%",
                      p: { xs: 0.5, sm: 1 },
                      overflow: "auto",
                    }}
                  >
                    <Stack spacing={1.5}>
                      {getFilteredOrders(OrderStatus.REQUIRE_REFUND).map(
                        (order: IOrder) => (
                          <OrderItem key={order.id} order={order} />
                        ),
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel
                    value="9"
                    sx={{
                      height: "100%",
                      p: { xs: 0.5, sm: 1 },
                      overflow: "auto",
                    }}
                  >
                    <Stack spacing={1.5}>
                      {getFilteredOrders(OrderStatus.REFUNDED).map(
                        (order: IOrder) => (
                          <OrderItem key={order.id} order={order} />
                        ),
                      )}
                    </Stack>
                  </TabPanel>
                  <TabPanel
                    value="10"
                    sx={{
                      height: "100%",
                      p: { xs: 0.5, sm: 1 },
                      overflow: "auto",
                    }}
                  >
                    <Stack spacing={1.5}>
                      {getFilteredOrders(OrderStatus.REJECTED).map(
                        (order: IOrder) => (
                          <OrderItem key={order.id} order={order} />
                        ),
                      )}
                    </Stack>
                  </TabPanel>
                </Box>
              </TabContext>
            </Box>
          </Box>
        </Box>
        {selectedOrder && selectedOrderDetail && isReviewModalOpen ? (
          <ReviewModal
            open={isReviewModalOpen}
            onClose={handleCloseReviewModal}
            orderDetail={selectedOrderDetail}
            onSubmit={handleReviewSubmit}
          />
        ) : null}
        {selectedOrder && isRefundModalOpen ? (
          <RefundModal
            open={isRefundModalOpen}
            onClose={handleCloseRefundModal}
            order={selectedOrder}
            onSubmit={handleRefundRequest}
          />
        ) : null}
        {selectedOrder && isCancelModalOpen ? (
          <CancelModal
            open={isCancelModalOpen}
            onClose={handleCloseCancelModal}
            order={selectedOrder}
            onSubmit={handleCancelRequest}
          />
        ) : null}
        {selectedOrder && isOrderDetailModalOpen ? (
          <OrderDetailModal
            open={isOrderDetailModalOpen}
            onClose={handleCloseOrderDetailModal}
            order={selectedOrder}
          />
        ) : null}
        {selectedOrder && selectedOrderDetail && isViewReviewModalOpen ? (
          <ViewReviewModal
            open={isViewReviewModalOpen}
            onClose={handleCloseViewReviewModal}
            orderDetail={selectedOrderDetail}
            review={selectedOrderDetail.review!}
            onDelete={handleDeleteReview}
          />
        ) : null}
      </Content>
    </>
  );
};

export default Orders;
