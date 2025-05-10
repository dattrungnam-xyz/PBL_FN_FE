import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
  Button,
  Avatar,
} from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useEffect, useState } from "react";
import { IAnalystic } from "../../interface";
import {
  getOrdersAnalystic,
  getRevenueAnalystic,
  getRevenueFiveDate,
} from "../../services/order.service";
import { getCustomerCount } from "../../services/customer.service";
import { getReviewCount } from "../../services/review.service";
import {
  getProductCountCategory,
  getTopProduct,
} from "../../services/product.service";
import { IProductTableData } from "../../interface/product.interface";
import { formatPrice } from "../../utils";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "../../stores";
import { useSelector } from "react-redux";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Analystic = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month",
  );
  const [revenue, setRevenue] = useState<IAnalystic>({
    currentCycle: 0,
    previousCycle: 0,
    percentage: 0,
  });
  const [orders, setOrders] = useState<IAnalystic>({
    currentCycle: 0,
    previousCycle: 0,
    percentage: 0,
  });
  const [customerCount, setCustomerCount] = useState<IAnalystic>({
    currentCycle: 0,
    previousCycle: 0,
    percentage: 0,
  });
  const [reviewCount, setReviewCount] = useState<IAnalystic>({
    currentCycle: 0,
    previousCycle: 0,
    percentage: 0,
  });
  const [topProduct, setTopProduct] = useState<IProductTableData[]>([]);

  const [revenueFiveDate, setRevenueFiveDate] = useState<
    {
      date: string;
      totalRevenue: number;
      totalOrders: number;
      revenuePerCustomer: number;
    }[]
  >([]);

  useEffect(() => {
    getRevenueAnalystic(timeRange).then((res) => {
      setRevenue(res);
    });
    getOrdersAnalystic(timeRange).then((res) => {
      setOrders(res);
    });
    getCustomerCount(timeRange).then((res) => {
      setCustomerCount(res);
    });
    getReviewCount(timeRange).then((res) => {
      setReviewCount(res);
    });
  }, [timeRange]);

  useEffect(() => {
    getTopProduct(timeRange).then((res) => {
      setTopProduct(res);
    });
  }, [timeRange]);

  useEffect(() => {
    getRevenueFiveDate().then((res) => {
      setRevenueFiveDate(res);
    });
  }, []);

  const { user } = useSelector((state: RootState) => state.auth);

  const { data: productCountCategory } = useQuery({
    queryKey: ["productCountCategory"],
    queryFn: () => getProductCountCategory(user?.storeId),
  });

  const productByCategory = [
    { name: "Thực phẩm", value: productCountCategory?.[0]?.count },
    { name: "Đồ uống", value: productCountCategory?.[1]?.count },
    { name: "Thủ công mỹ nghệ", value: productCountCategory?.[2]?.count },
    { name: "Thảo dược", value: productCountCategory?.[3]?.count },
  ];

  return (
    <Box sx={{ p: 0.5, maxWidth: 1200, margin: "0 auto" }}>
      <Stack spacing={0.5}>
        {/* Header */}
        <Card>
          <CardContent sx={{ p: 1 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={0.5}
            >
              <Typography variant="h6" fontWeight={600}>
                Phân tích cửa hàng
              </Typography>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  justifyContent: { xs: "space-between", sm: "flex-end" },
                }}
              >
                <Button
                  size="small"
                  variant={timeRange === "week" ? "contained" : "outlined"}
                  onClick={() => setTimeRange("week")}
                  sx={{ flex: { xs: 1, sm: "auto" } }}
                >
                  Tuần
                </Button>
                <Button
                  size="small"
                  variant={timeRange === "month" ? "contained" : "outlined"}
                  onClick={() => setTimeRange("month")}
                  sx={{ flex: { xs: 1, sm: "auto" } }}
                >
                  Tháng
                </Button>
                <Button
                  size="small"
                  variant={timeRange === "year" ? "contained" : "outlined"}
                  onClick={() => setTimeRange("year")}
                  sx={{ flex: { xs: 1, sm: "auto" } }}
                >
                  Năm
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={0.5}
          sx={{ flexWrap: "wrap" }}
          mt={0.5}
          ml={0}
        >
          <Card
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 200px" },
              minWidth: { xs: "100%", sm: 200 },
              maxWidth: { xs: "100%", sm: "none" },
              mt: 0.5,
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Stack spacing={0.25}>
                <Typography variant="body2" color="text.secondary">
                  Tổng doanh thu
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {formatPrice(revenue.currentCycle)}
                </Typography>
                <Typography
                  variant="caption"
                  color={
                    revenue.percentage >= 100 ? "success.main" : "error.main"
                  }
                >
                  {revenue.percentage}% so với kỳ trước
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          <Card
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 200px" },
              minWidth: { xs: "100%", sm: 200 },
              mt: 0.5,
              maxWidth: { xs: "100%", sm: "none" },
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Stack spacing={0.25}>
                <Typography variant="body2" color="text.secondary">
                  Số đơn hàng
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {orders.currentCycle}
                </Typography>
                <Typography
                  variant="caption"
                  color={
                    orders.percentage >= 100 ? "success.main" : "error.main"
                  }
                >
                  {orders.percentage}% so với kỳ trước
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          <Card
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 200px" },
              minWidth: { xs: "100%", sm: 200 },
              mt: 0.5,
              maxWidth: { xs: "100%", sm: "none" },
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Stack spacing={0.25}>
                <Typography variant="body2" color="text.secondary">
                  Số khách hàng
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {customerCount.currentCycle}
                </Typography>
                <Typography
                  variant="caption"
                  color={
                    customerCount.percentage >= 100
                      ? "success.main"
                      : "error.main"
                  }
                >
                  {customerCount.percentage}% so với kỳ trước
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          <Card
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 200px" },
              minWidth: { xs: "100%", sm: 200 },
              mt: 0.5,
              maxWidth: { xs: "100%", sm: "none" },
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Stack spacing={0.25}>
                <Typography variant="body2" color="text.secondary">
                  Đánh giá trung bình
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {reviewCount.currentCycle}
                </Typography>
                <Typography
                  variant="caption"
                  color={
                    reviewCount.percentage >= 100
                      ? "success.main"
                      : "error.main"
                  }
                >
                  {reviewCount.percentage}% so với kỳ trước
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Charts */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={0.5}
          sx={{ flexWrap: "wrap" }}
        >
          <Card
            sx={{
              flex: { xs: "1 1 100%", sm: "2 1 400px" },
              minWidth: { xs: "100%", sm: 400 },
              maxWidth: { xs: "100%", sm: "none" },
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Tổng quan cửa hàng
              </Typography>
              <Box
                sx={{
                  height: { xs: 250, sm: 300 },
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueFiveDate}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                    />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === "totalRevenue") {
                          return [formatPrice(value), "Doanh thu"];
                        }
                        if (name === "totalOrders") {
                          return [value, "Số đơn hàng"];
                        }
                        return [value, name];
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalRevenue"
                      stroke="#8884d8"
                      name="Doanh thu"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="totalOrders"
                      stroke="#82ca9d"
                      name="Số đơn hàng"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
          <Card
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 300px" },
              minWidth: { xs: "100%", sm: 300 },
              maxWidth: { xs: "100%", sm: "none" },
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Phân loại sản phẩm
              </Typography>
              <Box
                sx={{
                  height: { xs: 250, sm: 300 },
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name }) => `${name}`}
                    >
                      {productByCategory.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Top Products */}
        <Card>
          <CardContent sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Sản phẩm được đánh giá cao
            </Typography>
            <Stack spacing={0.5}>
              {topProduct?.map((product, index) => (
                <Paper
                  key={product.id}
                  variant="outlined"
                  sx={{
                    p: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "primary.main",
                      color: "white",
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {product.images?.[0] ? (
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 0,
                        }}
                      >
                        {product.name.charAt(0)}
                      </Avatar>
                    )}
                  </Box>
                  <Stack sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {product.name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Đánh giá: {product.avgRating?.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        | Đánh giá: {product.reviewCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        | Đơn hàng: {product.orderDetailCount}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Analystic;
