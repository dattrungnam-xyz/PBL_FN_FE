import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import RepeatIcon from "@mui/icons-material/Repeat";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ICustomerCountGroupByProvince,
  ICustomerStatistic,
  IProvince,
  ITopCustomer,
} from "../../interface";
import {
  getCustomerCountGroupByProvince,
  getCustomersOfStore,
  getCustomerStatistic,
  getTopCustomers,
} from "../../services/customer.service";
import { formatPrice } from "../../utils";
import { getProvinces } from "../../services/location.service";
import { useQuery } from "@tanstack/react-query";
import { OrderStatus } from "../../enums";

const Customer = () => {
  const [viewType, setViewType] = useState<"overview" | "list">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [customerCountGroupByProvince, setCustomerCountGroupByProvince] =
    useState<ICustomerCountGroupByProvince[]>([]);

  const [customerStatistic, setCustomerStatistic] =
    useState<ICustomerStatistic>({
      totalCustomers: 0,
      returningCustomers: 0,
      highlyRatedCustomers: 0,
      avrgRevenue: 0,
    });
  const [page, setPage] = useState(1);
  const [topCustomers, setTopCustomers] = useState<ITopCustomer[]>([]);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchCustomerStatistic = async () => {
      const response = await getCustomerStatistic();
      setCustomerStatistic(response);
    };
    fetchCustomerStatistic();

    const fetchTopCustomers = async () => {
      const response = await getTopCustomers();
      setTopCustomers(response);
    };
    fetchTopCustomers();

    const fetchCustomerCountGroupByProvince = async () => {
      const response = await getCustomerCountGroupByProvince();
      const provinces = await getProvinces();
      const newResponse = response.map((item) => {
        const province = provinces.find(
          (p: IProvince) => p.id === item.province,
        );
        return {
          ...item,
          provinceText: province?.name || "",
        };
      });
      setCustomerCountGroupByProvince(newResponse);
    };
    fetchCustomerCountGroupByProvince();
  }, []);

  const { data: customers } = useQuery({
    queryKey: ["customers-of-store", page, searchQuery],
    queryFn: () =>
      getCustomersOfStore({
        page: page,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
      }),
  });

  const renderOverview = () => (
    <Stack spacing={0.5}>
      {/* Summary Cards */}
      <Box
        display="flex"
        flexDirection="row"
        gap={0.5}
        sx={{ flexWrap: "wrap" }}
      >
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.25} alignItems="center">
              <PersonIcon color="primary" />
              <Typography variant="h4" fontWeight={600}>
                {customerStatistic.totalCustomers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tổng số khách hàng
              </Typography>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.25} alignItems="center">
              <ShoppingCartIcon color="success" />
              <Typography variant="h4" fontWeight={600}>
                {formatPrice(customerStatistic.avrgRevenue)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Giá trị đơn hàng trung bình
              </Typography>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.25} alignItems="center">
              <RepeatIcon color="warning" />
              <Typography variant="h4" fontWeight={600}>
                {customerStatistic.returningCustomers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Khách hàng quay lại
              </Typography>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.25} alignItems="center">
              <StarIcon color="info" />
              <Typography variant="h4" fontWeight={600}>
                {customerStatistic.highlyRatedCustomers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Khách hàng đánh giá cao
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Customer Activity */}
      <Card>
        <CardContent sx={{ p: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Phân bố khách hàng
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
            <Card sx={{ flex: 1, minWidth: 400 }}>
              <CardContent sx={{ p: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Phân bố theo khu vực
                </Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerCountGroupByProvince}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="provinceText" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="customerCount"
                        fill="#8884d8"
                        name="Số lượng"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardContent sx={{ p: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Khách hàng hàng đầu
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell align="right">Đơn hàng</TableCell>
                  <TableCell align="right">Tổng chi tiêu</TableCell>
                  <TableCell align="right">Đánh giá trung bình</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Avatar
                          src={customer.avatar}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Stack>
                          <Typography variant="body2" fontWeight={500}>
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {customer.phone}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{customer.orderCount}</TableCell>
                    <TableCell align="right">
                      {formatPrice(+customer.totalSpent)}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {(+customer.averageRating).toFixed(1)}
                        </Typography>
                        <StarIcon
                          sx={{ fontSize: 16, color: "warning.main" }}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );

  const renderCustomerList = () => (
    <Stack spacing={0.5}>
      <Card>
        <CardContent sx={{ p: 1 }}>
          <Stack spacing={0.5}>
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ flexWrap: "wrap" }}
            >
              <TextField
                size="small"
                placeholder="Tìm kiếm khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ flex: 1, minWidth: 200 }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 1 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Thông tin liên hệ</TableCell>
                  <TableCell align="right">Đơn hàng</TableCell>
                  <TableCell align="right">Tổng chi tiêu</TableCell>
                  <TableCell align="right">Đánh giá trung bình</TableCell>
                  <TableCell>Lần mua gần nhất</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers?.data?.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Avatar
                          src={customer.avatar}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Stack>
                          <Typography variant="body2" fontWeight={500}>
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Tham gia:{" "}
                            {format(new Date(customer.createdAt), "dd/MM/yyyy")}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack>
                        <Typography variant="body2">
                          {customer.phone}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {customer.email}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      {
                        customer.orders?.filter(
                          (order) =>
                            order.orderStatus !== OrderStatus.CANCELLED &&
                            order.orderStatus !== OrderStatus.REJECTED &&
                            order.orderStatus !== OrderStatus.REFUNDED,
                        ).length
                      }
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(
                        customer.orders
                          ?.filter(
                            (order) =>
                              order.orderStatus !== OrderStatus.CANCELLED &&
                              order.orderStatus !== OrderStatus.REJECTED &&
                              order.orderStatus !== OrderStatus.REFUNDED,
                          )
                          ?.reduce(
                            (acc, order) =>
                              acc + order.totalPrice - order.shippingFee,
                            0,
                          ),
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {customer.reviews?.reduce(
                            (acc, review) => acc + review.rating,
                            0,
                          ) / (customer.reviews?.length || 1)}
                        </Typography>
                        <StarIcon
                          sx={{ fontSize: 16, color: "warning.main" }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(
                          new Date(
                            customer.orders.sort(
                              (a, b) =>
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime(),
                            )[0].createdAt,
                          ),
                          "dd/MM/yyyy",
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack alignItems="center" sx={{ mt: 1 }}>
            <Pagination
              count={Math.ceil((customers?.total || 0) / ITEMS_PER_PAGE)}
              page={page}
              onChange={(_, value) => setPage(value)}
              size="small"
              color="primary"
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );

  return (
    <Box sx={{ p: 0.5, maxWidth: 1200, margin: "0 auto" }}>
      <Stack spacing={0.5}>
        {/* Header */}
        <Card>
          <CardContent sx={{ p: 1 }}>
            <Stack spacing={0.5}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={0.5}
              >
                <Typography variant="h6" fontWeight={600}>
                  Quản lý khách hàng
                </Typography>
              </Stack>
              <Tabs
                value={viewType}
                onChange={(_, value) => setViewType(value)}
                sx={{ minHeight: 36 }}
              >
                <Tab
                  value="overview"
                  label="Tổng quan"
                  sx={{ minHeight: 36, p: 0.5 }}
                />
                <Tab
                  value="list"
                  label="Danh sách"
                  sx={{ minHeight: 36, p: 0.5 }}
                />
              </Tabs>
            </Stack>
          </CardContent>
        </Card>

        {/* Content */}
        {viewType === "overview" && renderOverview()}
        {viewType === "list" && renderCustomerList()}
      </Stack>
    </Box>
  );
};

export default Customer;
