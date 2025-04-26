import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/user.service";
import {
  getProductByStoreId,
  getProductCountCategory,
} from "../../services/product.service";
import { getStores } from "../../services/store.service";
import { getVerify } from "../../services/verify.service";
import { VerifyOCOPStatus } from "../../enums";
import {
  PeopleAlt as PeopleIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  VerifiedUser as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAdminRevenue, getListOrders } from "../../services/order.service";
import { formatPrice } from "../../utils/helper";
import { getReviewAverage } from "../../services/review.service";
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "info";
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card
    sx={{
      height: "100%",
      borderRadius: 1,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      },
    }}
  >
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 500,
              mb: 0.25,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: `${color}.main`,
            }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({ page: 1, limit: 1, search: "" }),
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["orders-admin-dashboard"],
    queryFn: () => getListOrders({ page: 1, limit: 1 }),
  });

  const { data: revenue, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["revenue"],
    queryFn: () => getAdminRevenue(),
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      getProductByStoreId(undefined, { page: 1, limit: 1, search: "" }),
  });

  const { data: stores, isLoading: isLoadingStores } = useQuery({
    queryKey: ["stores"],
    queryFn: () =>
      getStores({
        page: 1,
        limit: 1,
        search: "",
        province: "",
        district: "",
        ward: "",
      }),
  });

  const { data: verifiedProducts, isLoading: isLoadingVerified } = useQuery({
    queryKey: ["verifiedProducts"],
    queryFn: () =>
      getVerify({
        page: 1,
        limit: 1,
        status: VerifyOCOPStatus.VERIFIED,
        search: "",
        storeId: null,
      }),
  });

  const { data: pendingVerify, isLoading: isLoadingPendingVerify } = useQuery({
    queryKey: ["pendingVerify"],
    queryFn: () =>
      getVerify({
        page: 1,
        limit: 1,
        status: VerifyOCOPStatus.PENDING,
      }),
  });

  const { data: reviewAverage, isLoading: isLoadingReviewAverage } = useQuery({
    queryKey: ["reviewAverage"],
    queryFn: () => getReviewAverage(),
  });

  const {
    data: productCountCategory,
    isLoading: isLoadingProductCountCategory,
  } = useQuery({
    queryKey: ["productCountCategory"],
    queryFn: () => getProductCountCategory(),
  });

  const isLoading =
    isLoadingUsers ||
    isLoadingProducts ||
    isLoadingStores ||
    isLoadingVerified ||
    isLoadingOrders ||
    isLoadingRevenue ||
    isLoadingPendingVerify ||
    isLoadingReviewAverage ||
    isLoadingProductCountCategory;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const stats = [
    {
      title: "Tổng số người dùng",
      value: users?.total || 0,
      icon: <PeopleIcon />,
      color: "primary" as const,
    },
    {
      title: "Tổng số sản phẩm",
      value: products?.total || 0,
      icon: <InventoryIcon />,
      color: "success" as const,
    },
    {
      title: "Tổng số cửa hàng",
      value: stores?.total || 0,
      icon: <StoreIcon />,
      color: "warning" as const,
    },
    {
      title: "Sản phẩm OCOP",
      value: verifiedProducts?.total || 0,
      icon: <VerifiedIcon />,
      color: "info" as const,
    },
    {
      title: "Tổng đơn hàng",
      value: orders?.total || 0,
      icon: <InventoryIcon />,
      color: "primary" as const,
    },
    {
      title: "Tổng doanh thu",
      value: formatPrice(revenue || 0),
      icon: <TrendingUpIcon />,
      color: "success" as const,
    },
    {
      title: "Yêu cầu phê duyệt",
      value: pendingVerify?.total || 0,
      icon: <VerifiedIcon />,
      color: "warning" as const,
    },
    {
      title: "Đánh giá trung bình",
      value: reviewAverage || 0,
      icon: <VerifiedIcon />,
      color: "info" as const,
    },
  ];

  const productDistributionData = [
    {
      name: "Thực phẩm",
      value: productCountCategory[0].count || 0,
      color: "#4CAF50",
    },
    {
      name: "Đồ uống",
      value: productCountCategory[1].count || 0,
      color: "#9C27B0",
    },
    {
      name: "Thủ công mỹ nghệ",
      value: productCountCategory[2].count || 0,
      color: "#2196F3",
    },
    {
      name: "Thảo dược",
      value: productCountCategory[3].count || 0,
      color: "#FF9800",
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        Tổng quan
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {stats.map((stat, index) => (
          <Box
            key={index}
            sx={{
              minWidth: {
                xs: "100%",
                sm: "calc(50% - 8px)",
                md: "calc(25% - 12px)",
              },
            }}
          >
            <StatCard {...stat} />
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(100% - 8px)" } }}>
          <Card
            sx={{
              borderRadius: 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <InventoryIcon sx={{ color: "primary.main" }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    fontSize: "0.875rem",
                  }}
                >
                  Phân bố sản phẩm theo danh mục
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name }) => `${name}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        fontSize: "0.75rem",
                        background: "white",
                      }}
                      formatter={(value: number) => [`${value}`, "Số lượng"]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => (
                        <span style={{ fontSize: "0.75rem", color: "#666" }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
