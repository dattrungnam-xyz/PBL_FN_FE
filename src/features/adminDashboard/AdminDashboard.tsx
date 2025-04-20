import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/user.service";
import { getProductByStoreId } from "../../services/product.service";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StatCardProps {
  title: string;
  value: number;
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

  const isLoading =
    isLoadingUsers || isLoadingProducts || isLoadingStores || isLoadingVerified;

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
  ];

  // Mock data for user growth chart (in a real app, this would come from your API)
  const userGrowthData = [
    { month: "Tháng 1", users: 100 },
    { month: "Tháng 2", users: 150 },
    { month: "Tháng 3", users: 200 },
    { month: "Tháng 4", users: 250 },
    { month: "Tháng 5", users: 300 },
    { month: "Tháng 6", users: users?.total || 0 },
  ];

  const recentActivities = [
    {
      title: "Người dùng mới",
      description: `${users?.total || 0} người dùng đã đăng ký`,
      icon: <PeopleIcon />,
      color: "primary",
      trend: "+12%",
    },
    {
      title: "Sản phẩm mới",
      description: `${products?.total || 0} sản phẩm được thêm vào`,
      icon: <InventoryIcon />,
      color: "success",
      trend: "+8%",
    },
    {
      title: "Cửa hàng mới",
      description: `${stores?.total || 0} cửa hàng đã đăng ký`,
      icon: <StoreIcon />,
      color: "warning",
      trend: "+5%",
    },
    {
      title: "Sản phẩm OCOP",
      description: `${verifiedProducts?.total || 0} sản phẩm được xác thực`,
      icon: <VerifiedIcon />,
      color: "info",
      trend: "+15%",
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

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {stats.map((stat, index) => (
          <Box
            key={index}
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 8px)",
                md: "1 1 calc(25% - 8px)",
              },
              minWidth: {
                xs: "100%",
                sm: "calc(50% - 8px)",
                md: "calc(25% - 8px)",
              },
            }}
          >
            <StatCard {...stat} />
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(66.66% - 8px)" } }}>
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
                <TrendingUpIcon sx={{ color: "primary.main" }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    fontSize: "0.875rem",
                  }}
                >
                  Tăng trưởng người dùng
                </Typography>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userGrowthData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                        fill: "#666",
                      }}
                      axisLine={{ stroke: "#e0e0e0" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "#666",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        fontSize: "0.75rem",
                        background: "white",
                      }}
                      formatter={(value: number) => [
                        `${value} người dùng`,
                        "Số lượng",
                      ]}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(value) => (
                        <span style={{ fontSize: "0.75rem", color: "#666" }}>
                          {value}
                        </span>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#1976d2"
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        stroke: "#1976d2",
                        strokeWidth: 2,
                        fill: "white",
                      }}
                      activeDot={{
                        r: 6,
                        stroke: "#1976d2",
                        strokeWidth: 2,
                        fill: "white",
                      }}
                      name="Số lượng người dùng"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(33.33% - 8px)" } }}>
          <Card
            sx={{
              borderRadius: 1,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: "0.875rem",
                }}
              >
                Hoạt động gần đây
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                {recentActivities.map((activity, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 1,
                      borderRadius: 0.75,
                      boxShadow: "none",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: `${activity.color}.main`,
                        bgcolor: `${activity.color}.lighter`,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: `white`,
                          color: `${activity.color}.main`,
                          width: 28,
                          height: 28,
                          fontSize: "0.875rem",
                        }}
                      >
                        {activity.icon}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              color: "text.primary",
                            }}
                          >
                            {activity.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "success.main",
                              fontWeight: 600,
                              bgcolor: "success.lighter",
                              px: 0.5,
                              py: 0.25,
                              borderRadius: 0.5,
                              fontSize: "0.625rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {activity.trend}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.25,
                            fontSize: "0.75rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {activity.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
