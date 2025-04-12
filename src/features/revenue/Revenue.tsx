import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useState } from "react";

interface RevenueMetrics {
  time: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

interface RevenueByCategory {
  category: string;
  revenue: number;
  percentage: number;
  growth: number;
}

interface TopProduct {
  id: string;
  name: string;
  image: string;
  sold: number;
  revenue: number;
}

interface RevenueData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueGrowth: number;
  revenueMetrics: RevenueMetrics[];
  revenueByCategory: RevenueByCategory[];
  topProducts: TopProduct[];
}

const mockRevenueData: RevenueData = {
  totalRevenue: 25000000,
  totalOrders: 200,
  averageOrderValue: 125000,
  revenueGrowth: 12.5,
  revenueMetrics: [
    { time: "1/1", revenue: 3000000, orders: 25, averageOrderValue: 120000 },
    { time: "2/1", revenue: 3500000, orders: 28, averageOrderValue: 125000 },
    { time: "3/1", revenue: 2800000, orders: 22, averageOrderValue: 127000 },
    { time: "4/1", revenue: 4200000, orders: 33, averageOrderValue: 127000 },
    { time: "5/1", revenue: 3800000, orders: 30, averageOrderValue: 126000 },
    { time: "6/1", revenue: 4500000, orders: 35, averageOrderValue: 128000 },
  ],
  revenueByCategory: [
    { category: "Nông sản", revenue: 10000000, percentage: 40, growth: 15 },
    { category: "Thủy sản", revenue: 7500000, percentage: 30, growth: 12 },
    { category: "Thực phẩm", revenue: 5000000, percentage: 20, growth: 8 },
    { category: "Khác", revenue: 2500000, percentage: 10, growth: 5 },
  ],
  topProducts: [
    {
      id: "1",
      name: "Gạo ST25",
      image: "https://example.com/rice.jpg",
      sold: 120,
      revenue: 6000000,
    },
    {
      id: "2",
      name: "Mật ong rừng",
      image: "https://example.com/honey.jpg",
      sold: 95,
      revenue: 4750000,
    },
    {
      id: "3",
      name: "Cá basa",
      image: "https://example.com/fish.jpg",
      sold: 80,
      revenue: 4000000,
    },
  ],
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const Revenue = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [revenueData] = useState<RevenueData>(mockRevenueData);

  return (
    <Box sx={{ p: 0.5, maxWidth: 1200, margin: "0 auto" }}>
      <Stack spacing={0.5}>
        {/* Header */}
        <Card>
          <CardContent sx={{ p: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={0.5}
            >
              <Typography variant="h6" fontWeight={600}>
                Doanh thu cửa hàng
              </Typography>
              <Tabs
                value={timeRange}
                onChange={(_, value) => setTimeRange(value)}
                sx={{ minHeight: 36 }}
              >
                <Tab value="week" label="Tuần" sx={{ minHeight: 36, p: 0.5 }} />
                <Tab
                  value="month"
                  label="Tháng"
                  sx={{ minHeight: 36, p: 0.5 }}
                />
                <Tab value="year" label="Năm" sx={{ minHeight: 36, p: 0.5 }} />
              </Tabs>
            </Stack>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ p: 1 }}>
              <Stack spacing={0.25}>
                <Typography variant="body2" color="text.secondary">
                  Tổng doanh thu
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {formatCurrency(revenueData.totalRevenue)}
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Tăng trưởng: {revenueData.revenueGrowth}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={revenueData.revenueGrowth}
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ p: 1 }}>
              <Stack spacing={0.25}>
                <Typography variant="body2" color="text.secondary">
                  Số đơn hàng
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {revenueData.totalOrders}
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Giá trị trung bình:{" "}
                    {formatCurrency(revenueData.averageOrderValue)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(revenueData.averageOrderValue / 150000) * 100}
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* Charts */}
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
          <Card sx={{ flex: 2, minWidth: 400 }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Doanh thu theo thời gian
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData.revenueMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="Doanh thu"
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Số đơn hàng"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 300 }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Doanh thu theo danh mục
              </Typography>
              <Stack spacing={1}>
                {revenueData.revenueByCategory.map((category) => (
                  <Stack key={category.category} spacing={0.5}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2">
                        {category.category}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(category.revenue)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LinearProgress
                        variant="determinate"
                        value={category.percentage}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "primary.lighter",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "primary.main",
                          },
                        }}
                      />
                      <Typography variant="caption" color="success.main">
                        +{category.growth}%
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* Top Products */}
        <Card>
          <CardContent sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Sản phẩm bán chạy
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="right">Đã bán</TableCell>
                    <TableCell align="right">Doanh thu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueData.topProducts.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                          <Typography variant="body2">
                            {product.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">{product.sold}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(product.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Revenue;
