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

// Define order status types and their properties
const orderStatuses = {
  pending_payment: {
    label: "Chờ thanh toán",
    color: "warning",
    icon: <PaymentOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  shipping: {
    label: "Vận chuyển",
    color: "info",
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
  pending_delivery: {
    label: "Chờ giao hàng",
    color: "info",
    icon: <InventoryOutlinedIcon sx={{ fontSize: "1rem" }} />,
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
  refund: {
    label: "Trả hàng/Hoàn tiền",
    color: "error",
    icon: <AssignmentReturnOutlinedIcon sx={{ fontSize: "1rem" }} />,
  },
} as const;

type OrderStatus = keyof typeof orderStatuses;

// Sample order data
const sampleOrders = [
  {
    id: "DH001",
    date: "2024-03-15",
    total: 350000,
    status: "pending_payment" as OrderStatus,
    items: [
      {
        id: 1,
        name: "Combo 12 Hộp 500 Chiếc Tăm Chỉ Nha Khoa",
        price: 100000,
        quantity: 2,
        image: "",
      },
      {
        id: 2,
        name: "Tăm Chỉ Nha Khoa Vệ Sinh Kẽ Răng",
        price: 150000,
        quantity: 1,
        image: "",
      },
    ],
    store: {
      id: 1,
      name: "SAM STORE household",
    },
  },
  {
    id: "DH002",
    date: "2024-03-14",
    total: 450000,
    status: "shipping" as OrderStatus,
    items: [
      {
        id: 3,
        name: "Bộ 10 Bàn Chải Đánh Răng Than Hoạt Tính",
        price: 450000,
        quantity: 1,
        image: "",
      },
    ],
    store: {
      id: 2,
      name: "Cửa Hàng Sức Khỏe",
    },
  },
  {
    id: "DH003",
    date: "2024-03-13",
    total: 280000,
    status: "pending_delivery" as OrderStatus,
    items: [
      {
        id: 4,
        name: "Kem Đánh Răng Thảo Dược Organic",
        price: 140000,
        quantity: 2,
        image: "",
      },
    ],
    store: {
      id: 3,
      name: "Organic Beauty Store",
    },
  },
  {
    id: "DH004",
    date: "2024-03-12",
    total: 520000,
    status: "completed" as OrderStatus,
    items: [
      {
        id: 5,
        name: "Máy Tăm Nước Cầm Tay Mini",
        price: 520000,
        quantity: 1,
        image: "",
      },
    ],
    store: {
      id: 4,
      name: "Tech Health Shop",
    },
  },
  {
    id: "DH005",
    date: "2024-03-11",
    total: 180000,
    status: "cancelled" as OrderStatus,
    items: [
      {
        id: 6,
        name: "Nước Súc Miệng Thảo Dược",
        price: 90000,
        quantity: 2,
        image: "",
      },
    ],
    store: {
      id: 5,
      name: "Herbal Care Shop",
    },
  },
  {
    id: "DH006",
    date: "2024-03-10",
    total: 750000,
    status: "refund" as OrderStatus,
    items: [
      {
        id: 7,
        name: "Máy Đánh Răng Điện Thông Minh",
        price: 750000,
        quantity: 1,
        image: "",
      },
    ],
    store: {
      id: 6,
      name: "Smart Device Store",
    },
  },
];

// Tab panel component
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
  const statusConfig = orderStatuses[status];
  return (
    <Chip
      icon={statusConfig.icon}
      label={statusConfig.label}
      size="small"
      color={statusConfig.color as "warning" | "info" | "success" | "error"}
      sx={{
        height: 24,
        '& .MuiChip-icon': {
          marginLeft: 1,
        },
      }}
    />
  );
};

// Order item component
const OrderItem = ({ order }: { order: typeof sampleOrders[0] }) => {
  // Helper function to render status-specific buttons
  const renderActionButtons = () => {
    switch (order.status) {
      case "pending_payment":
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
      case "shipping":
      case "pending_delivery":
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
      case "completed":
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
      case "cancelled":
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
      case "refund":
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
      }}
    >
      {/* Order Header */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {order.store.name}
          </Typography>
          <StatusChip status={order.status} />
        </Box>
        <Typography
          color="text.secondary"
          sx={{ fontSize: "0.813rem" }}
        >
          Đơn hàng: {order.id}
        </Typography>
      </Box>

      {/* Order Items */}
      <Stack divider={<Divider />}>
        {order.items.map((item) => (
          <Box
            key={item.id}
            sx={{
              p: { xs: 1.5, sm: 2 },
              display: "flex",
              gap: 1.5,
            }}
          >
            <Avatar
              variant="square"
              src={item.image}
              alt={item.name}
              sx={{
                width: 48,
                height: 48,
                bgcolor: "grey.300",
                fontSize: "1rem",
              }}
            >
              S
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  mb: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.name}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: "0.813rem" }}>
                {item.price.toLocaleString()}đ x {item.quantity}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>

      {/* Order Footer */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box>
          <Typography
            color="text.secondary"
            sx={{ fontSize: "0.813rem", mb: 0.5 }}
          >
            {new Date(order.date).toLocaleDateString("vi-VN")}
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
            Tổng tiền: {order.total.toLocaleString()}đ
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
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

  // Filter orders based on tab
  const getFilteredOrders = (status?: OrderStatus) => {
    if (!status) return sampleOrders;
    return sampleOrders.filter((order) => order.status === status);
  };

  return (
    <Content>
      <Box sx={{ py: { xs: 1, sm: 1.5, md: 2 } }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Page Title */}
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
              fontWeight: 600,
              mb: { xs: 1.5, sm: 2 },
            }}
          >
            Đơn hàng của tôi
          </Typography>

          {/* Order Status Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="order status tabs"
            >
              <Tab label="Tất cả" />
              <Tab label="Chờ thanh toán" />
              <Tab label="Vận chuyển" />
              <Tab label="Chờ giao hàng" />
              <Tab label="Hoàn thành" />
              <Tab label="Đã hủy" />
              <Tab label="Trả hàng/Hoàn tiền" />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <Stack spacing={{ xs: 1, sm: 1.5 }}>
            <TabPanel value={tabValue} index={0}>
              {getFilteredOrders().map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {getFilteredOrders("pending_payment").map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {getFilteredOrders("shipping").map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              {getFilteredOrders("pending_delivery").map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              {getFilteredOrders("completed").map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              {getFilteredOrders("cancelled").map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </TabPanel>
            <TabPanel value={tabValue} index={6}>
              {getFilteredOrders("refund").map((order) => (
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