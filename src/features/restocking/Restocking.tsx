import {
  Box,
  Button,
  Card,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  SelectChangeEvent,
  Chip,
} from "@mui/material";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { Category } from "../../enums";
import { RootState } from "../../stores";
import { useSelector } from "react-redux";
import { AuthState } from "../../stores/authSlice";
import { useQuery } from "@tanstack/react-query";
import { getProductByStoreId } from "../../services/product.service";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SellingProductStatus } from "../../enums";
import { getCategoryText } from "../../utils/getCategoryText";
import CustomBackdrop from "../../components/UI/CustomBackdrop";

import { getStockingProducts } from "../../services/restocking.service";
import { IRestocking } from "../../interface";
interface HeadCell {
  id: string;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: "images", label: "Hình ảnh", numeric: false, sortable: false },
  { id: "name", label: "Tên sản phẩm", numeric: false, sortable: false },
  { id: "category", label: "Danh mục", numeric: false, sortable: false },
  { id: "price", label: "Giá", numeric: true, sortable: false },
  {
    id: "restocking_quantity",
    label: "Số lượng nhập",
    numeric: true,
    sortable: false,
  },
  { id: "product_quantity", label: "Số lượng", numeric: true, sortable: false },
  { id: "status", label: "Trạng thái", numeric: false, sortable: false },
  { id: "createdAt", label: "Ngày tạo", numeric: false, sortable: false },
];

const categories = [
  Category.ALL,
  Category.FOOD,
  Category.BEVERAGE,
  Category.HERB,
  Category.HANDICRAFTS_DECORATION,
];

const Restocking = () => {
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
  const [selectedProduct, setSelectedProduct] = useState<string | "all">("all");

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

  const { data: products } = useQuery({
    queryKey: ["products", user?.storeId],
    queryFn: () =>
      getProductByStoreId(user?.storeId || "", {
        page: 1,
        limit: 10000,
      }),
  });

  const { data: restockingProducts, isLoading } = useQuery({
    queryKey: [
      "restockingProducts",
      user?.storeId,
      selectedProduct,
      selectedCategory,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      getStockingProducts({
        page: 1,
        limit: 10000,
        productId: selectedProduct,
        category: selectedCategory,
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
      <Box sx={{ p: 1, maxWidth: 1200, margin: "0 auto" }}>
        <Stack spacing={2}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4" color="text.primary" fontWeight={600}>
              Quản lí nhập sản phẩm
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: "success.main",
                "&:hover": {
                  bgcolor: "success.dark",
                },
              }}
            >
              Nhập sản phẩm
            </Button>
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
                  <InputLabel>Sản phẩm</InputLabel>
                  <Select
                    value={selectedProduct}
                    label="Sản phẩm"
                    onChange={(event) =>
                      setSelectedProduct(event.target.value as string | "all")
                    }
                  >
                    <MenuItem key="all" value="all">
                      Tất cả
                    </MenuItem>
                    {products?.data.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
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
                      >
                        {headCell.sortable ? (
                          <TableSortLabel>{headCell.label}</TableSortLabel>
                        ) : (
                          headCell.label
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {restockingProducts?.data.map((restocking: IRestocking) => (
                    <TableRow
                      key={restocking.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Avatar
                          src={restocking.product.images?.[0]}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        />
                      </TableCell>
                      <TableCell>{restocking.product.name}</TableCell>
                      <TableCell>
                        {getCategoryText(restocking.product.category)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPrice(restocking.product.price)}
                      </TableCell>
                      <TableCell align="right">{restocking.quantity}</TableCell>
                      <TableCell align="right">
                        {restocking.product.quantity}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            restocking.product.status ===
                            SellingProductStatus.SELLING
                              ? "Đang bán"
                              : "Ngừng bán"
                          }
                          color={
                            restocking.product.status ===
                            SellingProductStatus.SELLING
                              ? "success"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {format(new Date(restocking.createdAt), "dd/MM/yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={restockingProducts?.total || 0}
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

export default Restocking;
