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
  Avatar,
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
import { useState, useEffect } from "react";
import {
  IAnalystic,
  IAnalysticByCategory,
  IOrdersAnalystic,
} from "../../interface";
import {
  getOrdersAnalystic,
  getRevenueAnalystic,
  getRevenueAnalysticByCategory,
  getRevenueFiveMonth,
} from "../../services/order.service";
import { formatPrice, getCategoryText } from "../../utils";
import { IProductTableData } from "../../interface/product.interface";
import { getTrendProduct } from "../../services/product.service";

const Revenue = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [revenue, setRevenue] = useState<IAnalystic>({
    currentCycle: 0,
    previousCycle: 0,
    percentage: 0,
  });
  const [orders, setOrders] = useState<IOrdersAnalystic>({
    currentCycle: 0,
    previousCycle: 0,
    percentage: 0,
    currentCycleTotalPrice: 0,
    previousCycleTotalPrice: 0,
  });
  const [revenueByCategory, setRevenueByCategory] = useState<
    IAnalysticByCategory[]
  >([]);
  const [trendProduct, setTrendProduct] = useState<IProductTableData[]>([]);

  const [revenueFiveMonth, setRevenueFiveMonth] = useState<
    {
      month: string;
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
    getRevenueAnalysticByCategory(timeRange).then((res) => {
      setRevenueByCategory(res);
    });
    getTrendProduct(timeRange).then((res) => {
      setTrendProduct(res);
    });
  }, [timeRange]);

  useEffect(() => {
    getRevenueFiveMonth().then((res) => {
      setRevenueFiveMonth(res);
    });
  }, []);

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
                  {formatPrice(revenue.currentCycle)}
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    Tăng trưởng:{" "}
                    {revenue.previousCycle
                      ? (
                          (revenue.currentCycle / revenue.previousCycle) *
                          100
                        ).toFixed(2)
                      : 100}
                    %
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={
                      revenue.previousCycle
                        ? +(
                            (revenue.currentCycle / revenue.previousCycle) *
                            100
                          ).toFixed(2)
                        : 100
                    }
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
                  {orders.currentCycle}
                </Typography>
                <Stack spacing={0.5}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={0.5}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Giá trị trung bình:{" "}
                      {orders.currentCycle
                        ? formatPrice(
                            orders.currentCycleTotalPrice / orders.currentCycle,
                          )
                        : 0}{" "}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tăng trưởng:{" "}
                      {orders.previousCycleTotalPrice
                        ? (
                            (orders.currentCycleTotalPrice /
                              orders.previousCycleTotalPrice) *
                            100
                          ).toFixed(2)
                        : 100}
                      %
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={
                      orders.previousCycleTotalPrice &&
                      orders.currentCycleTotalPrice <
                        orders.previousCycleTotalPrice
                        ? +(
                            (orders.currentCycleTotalPrice /
                              orders.previousCycleTotalPrice) *
                            100
                          ).toFixed(2)
                        : 100
                    }
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* Charts */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          <Card sx={{ flex: 2, minWidth: 400 }}>
            <CardContent sx={{ p: 1 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={0.5}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  Doanh thu 5 tháng gần nhất
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Đơn vị: Triệu đồng
                </Typography>
              </Stack>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueFiveMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: "#f0f0f0" }}
                      label={{ value: "Tháng", position: "bottom", offset: 0 }}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value / 1000000}`}
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: "#f0f0f0" }}
                      label={{
                        value: "Triệu đồng",
                        angle: -90,
                        position: "insideLeft",
                        offset: 0,
                      }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === "Tổng doanh thu") {
                          return [formatPrice(value), "Doanh thu"];
                        }
                        return [formatPrice(value), "Đơn hàng trung bình"];
                      }}
                      labelFormatter={(label) => `Tháng ${label}`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: 8,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(value) => (
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {value}
                        </Typography>
                      )}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalRevenue"
                      stroke="#1976d2"
                      fill="#1976d2"
                      fillOpacity={0.2}
                      name="Tổng doanh thu"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenuePerCustomer"
                      stroke="#4CAF50"
                      fill="#4CAF50"
                      fillOpacity={0.2}
                      name="Số đơn hàng"
                      strokeWidth={2}
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
                {revenueByCategory.map((category) => {
                  const totalRevenue = revenueByCategory.reduce(
                    (acc, curr) => acc + curr.revenueCurrentCycle,
                    0,
                  );
                  return (
                    <Stack key={category.category} spacing={0.5}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2">
                          {getCategoryText(category.category)}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatPrice(category.revenueCurrentCycle || 0)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LinearProgress
                          variant="determinate"
                          value={
                            (category.revenueCurrentCycle / totalRevenue) *
                              100 || 0
                          }
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
                          {Math.round(
                            (category.revenueCurrentCycle / totalRevenue) *
                              100 || 0,
                          )}
                          %
                        </Typography>
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Box>

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
                  {trendProduct.map((product, index) => (
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
                            {product.images?.length > 0 ? (
                              <img
                                src={product.images[0]}
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
                                  backgroundColor: "primary.lighter",
                                }}
                              >
                                {product.name.charAt(0)}
                              </Avatar>
                            )}
                          </Box>
                          <Typography variant="body2">
                            {product.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        {product.orderDetailCount}
                      </TableCell>
                      <TableCell align="right">
                        {formatPrice(product.totalRevenue || 0)}
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
