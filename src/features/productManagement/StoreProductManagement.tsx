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
  SelectChangeEvent,
} from "@mui/material";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState, useEffect } from "react";
import { Category } from "../../enums";
import { RootState } from "../../stores";
import { useSelector } from "react-redux";
import { AuthState } from "../../stores/authSlice";
import { useQuery } from "@tanstack/react-query";
import {
  deleteProduct,
  getProductByStoreId,
} from "../../services/product.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SellingProductStatus, VerifyOCOPStatus } from "../../enums";
import { getCategoryText } from "../../utils/getCategoryText";
import { IProduct, IProductTableData } from "../../interface/product.interface";
import CustomBackdrop from "../../components/UI/CustomBackdrop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DynamicDialog from "../../components/DynamicDialog";
import ProductDetailModal from "./component/ProductDetailModal";
import UpdateQuantityModal from "./component/UpdateQuantityModal";
interface HeadCell {
  id: keyof IProductTableData;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: "images", label: "Hình ảnh", numeric: false, sortable: false },
  { id: "name", label: "Tên sản phẩm", numeric: false, sortable: false },
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

const StoreProductManagement = () => {
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
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState<string>("");

  const [openProductDetail, setOpenProductDetail] = useState(false);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  const [openUpdateQuantity, setOpenUpdateQuantity] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);

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
      selectedStatus,
      selectedVerifyOcopStatus,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      getProductByStoreId(user?.storeId || "", {
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

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.log(error);
      toast.error("Xóa sản phẩm thất bại");
    } finally {
      setOpen(false);
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
                      <TableCell>
                        {format(new Date(product.createdAt), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Tooltip title="Xem">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setProductId(product.id);
                                setOpenProductDetail(true);
                              }}
                            >
                              <VisibilityIcon
                                color="success"
                                fontSize="small"
                              />
                            </IconButton>
                          </Tooltip>
                          {product.verifyOcopStatus !==
                          VerifyOCOPStatus.VERIFIED ? (
                            <Tooltip title="Xác thực">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  navigate(
                                    `/seller/product/${product.id}/verify`,
                                  )
                                }
                                sx={{ color: "info.main" }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                          <Tooltip color="warning" title="Cập nhật số lượng">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setProduct(product as IProduct);
                                setOpenUpdateQuantity(true);
                              }}
                            >
                              <AddCircleOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/seller/product/${product.id}`)
                              }
                              sx={{ color: "warning.main" }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setOpen(true);
                                setProductId(product.id);
                              }}
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
        <DynamicDialog
          title="Xác nhận xóa sản phẩm"
          content="Bạn có chắc chắn muốn xóa sản phẩm?"
          confirmText="Xóa"
          cancelText="Hủy bỏ"
          open={open}
          type="alert"
          onClose={(confirm) =>
            confirm ? handleDelete(productId) : setOpen(false)
          }
          keepMounted={false}
        />

        <ProductDetailModal
          open={openProductDetail}
          onClose={() => setOpenProductDetail(false)}
          productId={productId}
        />
        {product ? (
          <UpdateQuantityModal
            open={openUpdateQuantity}
            onClose={() => setOpenUpdateQuantity(false)}
            product={product}
          />
        ) : null}
      </Box>
    </>
  );
};

export default StoreProductManagement;
