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
} from "@mui/material";
import { Content } from "../../layouts";
import { useState } from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "../../services/order.service";
import { IOrder } from "../../interface";
import { OrderStatus } from "../../enums";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const orderStatuses = {
  pending_payment: {
    label: "Chờ thanh toán",
    color: "warning",
    icon: <PaymentOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  preparing_for_shipping: {
    label: "Đang chuẩn bị",
    color: "info",
    icon: <InventoryOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  pending: {
    label: "Chờ xác nhận",
    color: "info",
    icon: <InventoryOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  confirmed: {
    label: "Xác nhận",
    color: "info",
    icon: <InventoryOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  shipping: {
    label: "Vận chuyển",
    color: "info",
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  completed: {
    label: "Hoàn thành",
    color: "success",
    icon: <CheckCircleOutlineIcon sx={{ fontSize: "1rem" }} />,
  },
  cancelled: {
    label: "Đã hủy",
    color: "error",
    icon: <CancelOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  refunded: {
    label: "Trả hàng/Hoàn tiền",
    color: "error",
    icon: <AssignmentReturnOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
} as const;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`order-tabpanel-${index}`}
      aria-labelledby={`order-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

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

const OrderItem = ({ order }: { order: IOrder }) => {
  const renderActionButtons = () => {
    switch (order.orderStatus) {
      case OrderStatus.PENDING_PAYMENT:
        return (
          <>
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              sx={{ fontSize: "0.813rem" }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ fontSize: "0.813rem" }}
            >
              Thanh toán
            </Button>
          </>
        );
      case OrderStatus.SHIPPING:
      case OrderStatus.CONFIRMED:
        return (
          <>
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              sx={{ fontSize: "0.813rem" }}
            >
              Theo dõi
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ fontSize: "0.813rem" }}
            >
              Đã nhận hàng
            </Button>
          </>
        );
      case OrderStatus.COMPLETED:
        return (
          <>
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              sx={{ fontSize: "0.813rem" }}
            >
              Mua lại
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ fontSize: "0.813rem" }}
            >
              Đánh giá
            </Button>
          </>
        );
      case OrderStatus.CANCELLED:
        return (
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            sx={{ fontSize: "0.813rem" }}
          >
            Mua lại
          </Button>
        );
      case OrderStatus.REFUNDED:
        return (
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            sx={{ fontSize: "0.813rem" }}
          >
            Chi tiết hoàn tiền
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* Order Header */}
      <Box
        sx={{
          p: { xs: 0.75, sm: 1 },
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 0.75,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
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
              p: { xs: 0.75, sm: 1 },
              display: "flex",
              gap: 0.75,
              alignItems: "center",
            }}
          >
            <Avatar
              variant="square"
              src={item.product.images[0]}
              alt={item.product.name}
              sx={{
                width: 40,
                height: 40,
                bgcolor: "grey.300",
                fontSize: "0.875rem",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              S
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: "0.938rem", sm: "1.125rem" },
                  fontWeight: 500,
                  mb: 0.25,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.product.name}
              </Typography>
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
            </Box>
          </Box>
        ))}
      </Stack>

      {/* Order Footer */}
      <Box
        sx={{
          p: { xs: 0.5, sm: 0.75 },
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
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
          spacing={0.5}
          sx={{
            "& .MuiButton-root": {
              minWidth: { xs: "auto", sm: 90 },
              px: { xs: 0.5, sm: 1 },
              fontSize: { xs: "0.75rem", sm: "0.813rem" },
              height: { xs: 24, sm: 28 },
            },
          }}
        >
          {renderActionButtons()}
        </Stack>
      </Box>
    </Paper>
  );
};

const Orders = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: getUserOrders,
  });

  // Filter orders based on tab
  const getFilteredOrders = (status?: OrderStatus) => {
    if (!orders) return [];
    if (!status) return orders;
    return orders.filter((order: IOrder) => order.orderStatus === status);
  };

  return (
    <Content>
      <Box sx={{ py: { xs: 0.5, sm: 1, md: 1.5 } }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 0.5, sm: 1 },
          }}
        >
          {/* Page Title */}
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
              fontWeight: 600,
              mb: { xs: 0.5, sm: 1 },
            }}
          >
            Đơn hàng của tôi
          </Typography>

          {/* Order Status Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="order status tabs"
            >
              <Tab label="Tất cả" />
              <Tab label="Chờ thanh toán" />
              <Tab label="Đang chuẩn bị" />
              <Tab label="Vận chuyển" />
              <Tab label="Chờ giao hàng" />
              <Tab label="Hoàn thành" />
              <Tab label="Đã hủy" />
              <Tab label="Trả hàng/Hoàn tiền" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Stack spacing={{ xs: 0.5, sm: 1 }}>
            <TabPanel value={tabValue} index={0}>
              {getFilteredOrders().map((order: IOrder) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {getFilteredOrders(OrderStatus.PREPARING_FOR_SHIPPING).map(
                (order: IOrder) => (
                  <OrderItem key={order.id} order={order} />
                ),
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {getFilteredOrders(OrderStatus.PENDING_PAYMENT).map(
                (order: IOrder) => (
                  <OrderItem key={order.id} order={order} />
                ),
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {getFilteredOrders(OrderStatus.SHIPPING).map((order: IOrder) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              {getFilteredOrders(OrderStatus.CONFIRMED).map((order: IOrder) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              {getFilteredOrders(OrderStatus.COMPLETED).map((order: IOrder) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              {getFilteredOrders(OrderStatus.CANCELLED).map((order: IOrder) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
            <TabPanel value={tabValue} index={6}>
              {getFilteredOrders(OrderStatus.REFUNDED).map((order: IOrder) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
          </Stack>
        </Box>
      </Box>
    </Content>
  );
};

export default Orders;
