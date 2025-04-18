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
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { Category } from "../../enums";
import { useQuery } from "@tanstack/react-query";
import { getProductByStoreId } from "../../services/product.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SellingProductStatus, VerifyOCOPStatus } from "../../enums";
import { getCategoryText } from "../../utils/getCategoryText";
import { IProductTableData } from "../../interface/product.interface";
import CustomBackdrop from "../../components/UI/CustomBackdrop";
interface HeadCell {
  id: keyof IProductTableData;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: "images", label: "Hình ảnh", numeric: false, sortable: false },
  { id: "name", label: "Tên sản phẩm", numeric: false, sortable: false },
  { id: "seller", label: "Cửa hàng", numeric: false, sortable: false },
  { id: "category", label: "Danh mục", numeric: false, sortable: false },
  { id: "price", label: "Giá", numeric: true, sortable: false },
  { id: "quantity", label: "Số lượng", numeric: true, sortable: false },
  { id: "status", label: "Trạng thái", numeric: false, sortable: false },
  {
    id: "verifyOcopStatus",
    label: "Trạng thái xác thực",
    numeric: false,
    sortable: false,
  },
  { id: "createdAt", label: "Ngày tạo", numeric: false, sortable: false },
];

const categories = [
  Category.ALL,
  Category.FOOD,
  Category.BEVERAGE,
  Category.HERB,
  Category.HANDICRAFTS_DECORATION,
];

const AdminProduct = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    Category.ALL,
  );
  const [selectedStatus, setSelectedStatus] = useState<SellingProductStatus>(
    SellingProductStatus.ALL,
  );
  const [selectedVerifyOcopStatus, setSelectedVerifyOcopStatus] =
    useState<VerifyOCOPStatus>(VerifyOCOPStatus.ALL);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");

  const { data: products, isLoading } = useQuery({
    queryKey: [
      "products",
      storeId,
      page,
      rowsPerPage,
      selectedCategory,
      selectedStatus,
      selectedVerifyOcopStatus,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      getProductByStoreId(storeId ?? undefined, {
        page,
        limit: rowsPerPage,
        category: selectedCategory,
        status: selectedStatus,
        search: debouncedSearchTerm,
        verifyStatus: selectedVerifyOcopStatus,
      }),
  });

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

  const handleVerifyOcopStatusChange = (
    event: SelectChangeEvent<VerifyOCOPStatus>,
  ) => {
    const value = event.target.value as VerifyOCOPStatus;
    setSelectedVerifyOcopStatus(value);
  };

  const handleStatusChange = (
    event: SelectChangeEvent<SellingProductStatus>,
  ) => {
    const value = event.target.value as SellingProductStatus;
    setSelectedStatus(value);
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

  return (
    <>
      {isLoading && <CustomBackdrop />}
      <Box>
        <Stack spacing={1}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" color="text.primary" fontWeight={600}>
              Quản lý sản phẩm
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
                    value={selectedVerifyOcopStatus}
                    label="Trạng thái xác thực"
                    onChange={handleVerifyOcopStatusChange}
                  >
                    {Object.values(VerifyOCOPStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status === VerifyOCOPStatus.VERIFIED
                          ? "Đã xác thực"
                          : status === VerifyOCOPStatus.REJECTED
                            ? "Từ chối"
                            : status === VerifyOCOPStatus.PENDING
                              ? "Chờ xác thực"
                              : status === VerifyOCOPStatus.NOT_SUBMITTED
                                ? "Chưa gửi"
                                : "Tất cả"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={selectedStatus}
                    label="Trạng thái"
                    onChange={handleStatusChange}
                  >
                    {Object.values(SellingProductStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status === SellingProductStatus.SELLING
                          ? "Đang bán"
                          : status === SellingProductStatus.STOPPED
                            ? "Ngừng bán"
                            : "Tất cả"}
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
                        sx={{ fontSize: "0.75rem", py: 0.25 }}
                      >
                        {headCell.sortable ? (
                          <TableSortLabel>{headCell.label}</TableSortLabel>
                        ) : (
                          headCell.label
                        )}
                      </TableCell>
                    ))}
                    <TableCell
                      sx={{ fontSize: "0.75rem", fontWeight: 600, py: 0.25 }}
                      align="center"
                    >
                      Thao tác
                    </TableCell>
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
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        {product.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            src={product.seller.avatar}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                          />
                          <Typography variant="inherit">
                            {product.seller.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        {getCategoryText(product.category)}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.75rem", py: 0.25 }}
                        align="right"
                      >
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.75rem", py: 0.25 }}
                        align="right"
                      >
                        {product.quantity}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
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
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        <Chip
                          label={
                            product.verifyOcopStatus ===
                            VerifyOCOPStatus.VERIFIED
                              ? "Đã xác thực"
                              : product.verifyOcopStatus ===
                                  VerifyOCOPStatus.REJECTED
                                ? "Từ chối"
                                : product.verifyOcopStatus ===
                                    VerifyOCOPStatus.PENDING
                                  ? "Chờ xác thực"
                                  : "Chưa xác thực"
                          }
                          color={
                            product.verifyOcopStatus ===
                            VerifyOCOPStatus.VERIFIED
                              ? "success"
                              : product.verifyOcopStatus ===
                                  VerifyOCOPStatus.REJECTED
                                ? "error"
                                : product.verifyOcopStatus ===
                                    VerifyOCOPStatus.PENDING
                                  ? "warning"
                                  : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        {format(new Date(product.createdAt), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", py: 0.25 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/seller/product/${product.id}`)
                              }
                              sx={{ color: "primary.main" }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
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

export default AdminProduct;
