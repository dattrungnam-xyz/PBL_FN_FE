import {
  Box,
  Button,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  code: string;
  price: number;
  quantity: number;
  status: "active" | "inactive";
  createdAt: string;
  image: string;
  category: string;
  verifyStatus: "accepted" | "rejected" | "pending";
}

type Order = "asc" | "desc";

interface HeadCell {
  id: keyof Product;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: "image", label: "Hình ảnh", numeric: false, sortable: false },
  { id: "code", label: "Mã sản phẩm", numeric: false, sortable: true },
  { id: "name", label: "Tên sản phẩm", numeric: false, sortable: true },
  { id: "category", label: "Danh mục", numeric: false, sortable: true },
  { id: "price", label: "Giá", numeric: true, sortable: true },
  { id: "quantity", label: "Số lượng", numeric: true, sortable: true },
  { id: "status", label: "Trạng thái", numeric: false, sortable: true },
  {
    id: "verifyStatus",
    label: "Trạng thái xác thực",
    numeric: false,
    sortable: true,
  },
  { id: "createdAt", label: "Ngày tạo", numeric: false, sortable: true },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Sản phẩm OCOP 1",
    code: "OCOP001",
    price: 100000,
    quantity: 50,
    status: "active",
    createdAt: "2024-03-15",
    image: "https://picsum.photos/200",
    category: "Thực phẩm",
    verifyStatus: "pending",
  },
  {
    id: 2,
    name: "Sản phẩm OCOP 2",
    code: "OCOP002",
    price: 150000,
    quantity: 30,
    status: "active",
    createdAt: "2024-03-15",
    image: "https://picsum.photos/200",
    category: "Đồ uống",
    verifyStatus: "rejected",
  },
  {
    id: 2,
    name: "Sản phẩm OCOP 2",
    code: "OCOP002",
    price: 150000,
    quantity: 30,
    status: "active",
    createdAt: "2024-03-15",
    image: "https://picsum.photos/200",
    category: "Đồ uống",
    verifyStatus: "accepted",
  },
  {
    id: 2,
    name: "Sản phẩm OCOP 2",
    code: "OCOP002",
    price: 150000,
    quantity: 30,
    status: "active",
    createdAt: "2024-03-15",
    image: "https://picsum.photos/200",
    category: "Đồ uống",
    verifyStatus: "rejected",
  },
  {
    id: 2,
    name: "Sản phẩm OCOP 2",
    code: "OCOP002",
    price: 150000,
    quantity: 30,
    status: "active",
    createdAt: "2024-03-15",
    image: "https://picsum.photos/200",
    category: "Đồ uống",
    verifyStatus: "pending",
  },
  // Add more mock data as needed
];

const categories = [
  "Tất cả",
  "Thực phẩm",
  "Đồ uống",
  "Thủ công mỹ nghệ",
  "Dược liệu",
];
const statuses = ["Tất cả", "active", "inactive"];

const StoreProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Product>("name");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");

  const handleRequestSort = (property: keyof Product) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterProducts(value, selectedCategory, selectedStatus);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const value = event.target.value as string;
    setSelectedCategory(value);
    filterProducts(searchTerm, value, selectedStatus);
  };

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setSelectedStatus(value);
    filterProducts(searchTerm, selectedCategory, value);
  };

  const filterProducts = (search: string, category: string, status: string) => {
    let filtered = mockProducts;

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.code.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Filter by category
    if (category !== "Tất cả") {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Filter by status
    if (status !== "Tất cả") {
      filtered = filtered.filter((product) => product.status === status);
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return order === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    setFilteredProducts(filtered);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleView = (id: number) => {
    console.log("View product", id);
  };

  const handleEdit = (id: number) => {
    console.log("Edit product", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete product", id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Box sx={{ p: 1, maxWidth: 1200, margin: "0 auto" }}>
      <Stack spacing={2}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" color="text.primary" fontWeight={600}>
            Quản lý sản phẩm
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
            Thêm sản phẩm
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
                  //   onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Trạng thái"
                  //   onChange={handleStatusChange}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status === "active"
                        ? "Đang bán"
                        : status === "inactive"
                          ? "Ngừng bán"
                          : "Tất cả"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Trạng thái xác thực</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Trạng thái xác thực"
                  //   onChange={handleStatusChange}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status === "accepted"
                        ? "Đã xác thực"
                        : status === "rejected"
                          ? "Từ chối"
                          : "Chờ xác thực"}
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
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      {headCell.sortable ? (
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : "asc"}
                          onClick={() => handleRequestSort(headCell.id)}
                        >
                          {headCell.label}
                        </TableSortLabel>
                      ) : (
                        headCell.label
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow
                      key={product.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Avatar
                          src={product.image}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        />
                      </TableCell>
                      <TableCell>{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell align="right">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            product.status === "active"
                              ? "Đang bán"
                              : "Ngừng bán"
                          }
                          color={
                            product.status === "active" ? "success" : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            product.verifyStatus === "accepted"
                              ? "Đã xác thực"
                              : product.verifyStatus === "rejected"
                                ? "Từ chối"
                                : "Chờ xác thực"
                          }
                          color={
                            product.verifyStatus === "accepted"
                              ? "success"
                              : product.verifyStatus === "rejected"
                                ? "error"
                                : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{product.createdAt}</TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              size="small"
                              onClick={() => handleView(product.id)}
                              sx={{ color: "info.main" }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(product.id)}
                              sx={{ color: "warning.main" }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(product.id)}
                              sx={{ color: "error.main" }}
                            >
                              <DeleteIcon fontSize="small" />
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
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </Card>
      </Stack>
    </Box>
  );
};

export default StoreProductManagement;
