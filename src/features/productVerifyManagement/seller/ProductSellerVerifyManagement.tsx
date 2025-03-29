import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  SelectChangeEvent,
} from "@mui/material";
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../../../stores";
import { AuthState } from "../../../stores/authSlice";
import { getProductByStoreId } from "../../../services/product.service";
import { SellingProductStatus, VerifyOCOPStatus, Category } from "../../../enums";
import { getCategoryText } from "../../../utils/getCategoryText";
import { IProductTableData } from "../../../interface/product.interface";
import CustomBackdrop from "../../../components/UI/CustomBackdrop";

interface HeadCell {
  id: keyof IProductTableData;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: "images", label: "Hình ảnh", numeric: false, sortable: false },
  { id: "name", label: "Tên sản phẩm", numeric: false, sortable: true },
  { id: "category", label: "Danh mục", numeric: false, sortable: true },
  { id: "price", label: "Giá", numeric: true, sortable: true },
  { id: "quantity", label: "Số lượng", numeric: true, sortable: true },
  { id: "status", label: "Trạng thái", numeric: false, sortable: true },
  {
    id: "verifyOcopStatus",
    label: "Trạng thái xác thực",
    numeric: false,
    sortable: true,
  },
  { id: "createdAt", label: "Ngày tạo", numeric: false, sortable: true },
];

const categories = [
  Category.FOOD,
  Category.BEVERAGE,
  Category.HERB,
  Category.HANDICRAFTS_DECORATION,
  Category.ALL,
];

const ProductSellerVerifyManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    Category.ALL,
  );
  const [selectedVerifyStatus, setSelectedVerifyStatus] =
    useState<VerifyOCOPStatus>(VerifyOCOPStatus.ALL);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const { data: products, isLoading } = useQuery({
    queryKey: [
      "products",
      user?.storeId,
      page,
      rowsPerPage,
      selectedCategory,
      selectedVerifyStatus,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      getProductByStoreId(user?.storeId || "", {
        page,
        limit: rowsPerPage,
        category: selectedCategory,
        verifyStatus: selectedVerifyStatus,
        search: debouncedSearchTerm,
      }),
  });

  if (!user || !user.storeId) {
    toast.error("Bạn chưa tạo cửa hàng");
    return <Navigate to="/seller/create" />;
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    window.history.pushState({}, "", `${window.location.pathname}?page=${1}`);
    setPage(1);
  };

  const handleCategoryChange = (event: SelectChangeEvent<Category>) => {
    const value = event.target.value as Category;
    setSelectedCategory(value);
    window.history.pushState({}, "", `${window.location.pathname}?page=${1}`);
    setPage(1);
  };

  const handleVerifyStatusChange = (
    event: SelectChangeEvent<VerifyOCOPStatus>,
  ) => {
    const value = event.target.value as VerifyOCOPStatus;
    setSelectedVerifyStatus(value);
    window.history.pushState({}, "", `${window.location.pathname}?page=${1}`);
    setPage(1);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage + 1);
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?page=${newPage + 1}`,
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    window.history.pushState({}, "", `${window.location.pathname}?page=${1}`);
    setPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getVerifyStatusText = (status: VerifyOCOPStatus) => {
    switch (status) {
      case VerifyOCOPStatus.VERIFIED:
        return "Đã xác thực";
      case VerifyOCOPStatus.REJECTED:
        return "Từ chối";
      case VerifyOCOPStatus.PENDING:
        return "Chờ xác thực";
      case VerifyOCOPStatus.ALL:
        return "Tất cả";
      default:
        return "Chưa xác thực";
    }
  };

  const getVerifyStatusColor = (status: VerifyOCOPStatus) => {
    switch (status) {
      case VerifyOCOPStatus.VERIFIED:
        return "success";
      case VerifyOCOPStatus.REJECTED:
        return "error";
      case VerifyOCOPStatus.PENDING:
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <>
      {isLoading && <CustomBackdrop />}
      <Box sx={{ p: 1, maxWidth: 1200, margin: "0 auto" }}>
        <Stack spacing={2}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4" color="text.primary" fontWeight={600}>
              Quản lý xác thực OCOP
            </Typography>
          </Stack>

          {/* Search and Filter */}
          <Card sx={{ p: 1 }}>
            <Stack spacing={1}>
              <Typography variant="h6">Tìm kiếm và lọc</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm theo tên hoặc mã sản phẩm"
                  value={searchTerm}
                  onChange={handleSearch}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                  size="small"
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Danh mục"
                    onChange={handleCategoryChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {getCategoryText(category)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Trạng thái xác thực</InputLabel>
                  <Select
                    value={selectedVerifyStatus}
                    label="Trạng thái xác thực"
                    onChange={handleVerifyStatusChange}
                  >
                    {Object.values(VerifyOCOPStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {getVerifyStatusText(status)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Card>

          {/* Product Table */}
          <Card>
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                      >
                        {headCell.sortable ? (
                          <TableSortLabel>{headCell.label}</TableSortLabel>
                        ) : (
                          headCell.label
                        )}
                      </TableCell>
                    ))}
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products?.data.map((product) => (
                    <TableRow
                      key={product.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Avatar
                          src={product.images?.[0]}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{getCategoryText(product.category)}</TableCell>
                      <TableCell align="right">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            product.status === SellingProductStatus.SELLING
                              ? "Đang bán"
                              : "Ngừng bán"
                          }
                          color={
                            product.status === SellingProductStatus.SELLING
                              ? "success"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getVerifyStatusText(product.verifyOcopStatus)}
                          color={getVerifyStatusColor(product.verifyOcopStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(product.createdAt), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Tooltip title="Lịch sử xác thực">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(
                                  `/seller/product/${product.id}/verify-history`,
                                )
                              }
                              sx={{ color: "info.main" }}
                            >
                              <HistoryIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {product.verifyOcopStatus !==
                            VerifyOCOPStatus.VERIFIED && (
                            <Tooltip title="Xác thực OCOP">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  navigate(
                                    `/seller/product/${product.id}/verify`,
                                  )
                                }
                                sx={{ color: "success.main" }}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={products?.total || 0}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số hàng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} / ${count !== -1 ? count : `hơn ${to}`}`
              }
            />
          </Card>
        </Stack>
      </Box>
    </>
  );
};

export default ProductSellerVerifyManagement;
