import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
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
  Button,
  ButtonGroup,
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
  LineChart,
  Line,
} from "recharts";
import { ICustomerStatistic, ITopCustomer } from "../../interface";
import {
  getCustomerStatistic,
  getTopCustomers,
} from "../../services/customer.service";

interface Customer {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  averageRating: number;
  tags: string[];
  favoriteCategories: string[];
}

interface CustomerStats {
  totalCustomers: number;
  returningCustomers: number;
  highlyRatedCustomers: number;
  averageOrderValue: number;
  topCustomers: Customer[];
  customerSegments: {
    loyal: number;
    regular: number;
    new: number;
    inactive: number;
  };
}

interface CustomerActivity {
  date: string;
  orders: number;
  revenue: number;
  newCustomers: number;
}

interface CustomerDemographics {
  ageGroups: {
    name: string;
    value: number;
  }[];
  genderDistribution: {
    name: string;
    value: number;
  }[];
  locationDistribution: {
    name: string;
    value: number;
  }[];
}

const mockCustomerStats: CustomerStats = {
  totalCustomers: 1500,
  returningCustomers: 800,
  highlyRatedCustomers: 450,
  averageOrderValue: 250000,
  topCustomers: [
    {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://example.com/avatar1.jpg",
      phone: "0987654321",
      email: "nguyenvana@example.com",
      joinDate: "2023-01-15",
      totalOrders: 25,
      totalSpent: 7500000,
      lastOrderDate: "2024-03-15",
      averageRating: 4.8,
      tags: ["VIP", "Thường xuyên"],
      favoriteCategories: ["Gạo", "Thực phẩm khô"],
    },
    {
      id: "2",
      name: "Trần Thị B",
      avatar: "https://example.com/avatar2.jpg",
      phone: "0987654322",
      email: "tranthib@example.com",
      joinDate: "2023-06-20",
      totalOrders: 18,
      totalSpent: 4500000,
      lastOrderDate: "2024-03-10",
      averageRating: 4.5,
      tags: ["Thường xuyên"],
      favoriteCategories: ["Rau củ", "Trái cây"],
    },
    {
      id: "3",
      name: "Lê Văn C",
      avatar: "https://example.com/avatar3.jpg",
      phone: "0987654323",
      email: "levanc@example.com",
      joinDate: "2024-02-01",
      totalOrders: 3,
      totalSpent: 750000,
      lastOrderDate: "2024-03-05",
      averageRating: 4.2,
      tags: ["Mới"],
      favoriteCategories: ["Thực phẩm tươi"],
    },
  ],
  customerSegments: {
    loyal: 500,
    regular: 700,
    new: 50,
    inactive: 250,
  },
};

const mockCustomerActivity: CustomerActivity[] = [
  { date: "1/3", orders: 25, revenue: 7500000, newCustomers: 5 },
  { date: "2/3", orders: 30, revenue: 9000000, newCustomers: 8 },
  { date: "3/3", orders: 28, revenue: 8400000, newCustomers: 6 },
  { date: "4/3", orders: 35, revenue: 10500000, newCustomers: 10 },
  { date: "5/3", orders: 32, revenue: 9600000, newCustomers: 7 },
  { date: "6/3", orders: 40, revenue: 12000000, newCustomers: 12 },
  { date: "7/3", orders: 38, revenue: 11400000, newCustomers: 9 },
];

const mockCustomerDemographics: CustomerDemographics = {
  ageGroups: [
    { name: "18-24", value: 300 },
    { name: "25-34", value: 450 },
    { name: "35-44", value: 350 },
    { name: "45-54", value: 250 },
    { name: "55+", value: 150 },
  ],
  genderDistribution: [
    { name: "Nam", value: 800 },
    { name: "Nữ", value: 700 },
  ],
  locationDistribution: [
    { name: "Hà Nội", value: 450 },
    { name: "TP.HCM", value: 380 },
    { name: "Đà Nẵng", value: 220 },
    { name: "Hải Phòng", value: 180 },
    { name: "Cần Thơ", value: 150 },
    { name: "Khác", value: 120 },
  ],
};

const Customer = () => {
  const [viewType, setViewType] = useState<"overview" | "list">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [customerStats] = useState<CustomerStats>(mockCustomerStats);

  const [customerStatistic, setCustomerStatistic] =
    useState<ICustomerStatistic>({
      totalCustomers: 0,
      returningCustomers: 0,
      highlyRatedCustomers: 0,
      avrgRevenue: 0,
    });

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
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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
                {formatCurrency(customerStatistic.avrgRevenue)}
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
            <Card sx={{ flex: 2, minWidth: 400 }}>
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
                    <BarChart
                      data={mockCustomerDemographics.locationDistribution}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" name="Số lượng" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 300 }}>
              <CardContent sx={{ p: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Khách hàng mới
                </Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockCustomerActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="newCustomers"
                        stroke="#ffc658"
                        name="Khách hàng mới"
                      />
                    </LineChart>
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
                  <TableCell>Lần mua gần nhất</TableCell>
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
                      {formatCurrency(customer.totalSpent)}
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
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(customer.lastOrder), "dd/MM/yyyy")}
                      </Typography>
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
              <ButtonGroup size="small">
                <Button
                  variant={selectedSegment === "all" ? "contained" : "outlined"}
                  onClick={() => setSelectedSegment("all")}
                >
                  Tất cả
                </Button>
                <Button
                  variant={
                    selectedSegment === "loyal" ? "contained" : "outlined"
                  }
                  onClick={() => setSelectedSegment("loyal")}
                >
                  Trung thành
                </Button>
                <Button
                  variant={
                    selectedSegment === "regular" ? "contained" : "outlined"
                  }
                  onClick={() => setSelectedSegment("regular")}
                >
                  Thường xuyên
                </Button>
                <Button
                  variant={selectedSegment === "new" ? "contained" : "outlined"}
                  onClick={() => setSelectedSegment("new")}
                >
                  Mới
                </Button>
                <Button
                  variant={
                    selectedSegment === "inactive" ? "contained" : "outlined"
                  }
                  onClick={() => setSelectedSegment("inactive")}
                >
                  Không hoạt động
                </Button>
              </ButtonGroup>
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
                  <TableCell>Thẻ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerStats.topCustomers.map((customer) => (
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
                            Tham gia: {customer.joinDate}
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
                    <TableCell align="right">{customer.totalOrders}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(customer.totalSpent)}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {customer.averageRating}
                        </Typography>
                        <StarIcon
                          sx={{ fontSize: 16, color: "warning.main" }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(customer.lastOrderDate).toLocaleDateString(
                          "vi-VN",
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {customer.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack alignItems="center" sx={{ mt: 1 }}>
            <Pagination
              count={Math.ceil(
                customerStats.topCustomers.length / ITEMS_PER_PAGE,
              )}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
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
