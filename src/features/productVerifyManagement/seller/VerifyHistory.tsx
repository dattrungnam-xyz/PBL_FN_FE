import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { AuthState } from "../../../stores/authSlice";
import { toast } from "react-toastify";
import CustomBackdrop from "../../../components/UI/CustomBackdrop";
import { getProductByStoreId } from "../../../services/product.service";
import { IProductTableData } from "../../../interface/product.interface";
import { VerifyOCOPStatus } from "../../../enums";

interface VerifyHistoryItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  star: number;
  unit: string;
  address: string;
  issueDate: string;
  certificates: string[];
  status: VerifyOCOPStatus;
  createdAt: string;
  updatedAt: string;
}

interface TableHeader {
  id: keyof VerifyHistoryItem;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any) => string;
}

const tableHeaders: TableHeader[] = [
  { id: "productName", label: "Sản phẩm", minWidth: 200 },
  { id: "star", label: "Số sao", minWidth: 100, align: "center" },
  { id: "unit", label: "Đơn vị", minWidth: 100 },
  { id: "address", label: "Địa chỉ", minWidth: 200 },
  { id: "issueDate", label: "Ngày cấp", minWidth: 120 },
  { id: "status", label: "Trạng thái", minWidth: 120, align: "center" },
  { id: "createdAt", label: "Ngày tạo", minWidth: 150 },
  { id: "action", label: "Thao tác", minWidth: 100, align: "center" },
];

const VerifyHistory = () => {
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<VerifyOCOPStatus>(VerifyOCOPStatus.ALL);
  const [selectedHistory, setSelectedHistory] = useState<VerifyHistoryItem | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", user?.storeId, debouncedSearchTerm, selectedStatus],
    queryFn: () =>
      getProductByStoreId(user?.storeId, {
        search: debouncedSearchTerm,
        page: 1,
        limit: 100,
        verifyStatus: selectedStatus !== VerifyOCOPStatus.ALL ? selectedStatus : undefined,
      }),
    enabled: !!user?.storeId,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(event.target.value as VerifyOCOPStatus);
  };

  const handleOpenModal = (product: IProductTableData) => {
    // TODO: Replace with actual API call to get verification history
    const mockHistory: VerifyHistoryItem = {
      id: product.id,
      productId: product.id,
      productName: product.name,
      productImage: product.images?.[0] || "",
      star: 5,
      unit: "kg",
      address: "Địa chỉ mẫu",
      issueDate: "2024-03-20",
      certificates: ["cert1.jpg", "cert2.jpg"],
      status: product.verifyOcopStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSelectedHistory(mockHistory);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedHistory(null);
    setOpenModal(false);
  };

  const getStatusColor = (status: VerifyOCOPStatus) => {
    switch (status) {
      case VerifyOCOPStatus.VERIFIED:
        return "success.main";
      case VerifyOCOPStatus.REJECTED:
        return "error.main";
      case VerifyOCOPStatus.PENDING:
        return "warning.main";
      case VerifyOCOPStatus.NOT_SUBMITTED:
        return "info.main";
      default:
        return "text.primary";
    }
  };

  const getStatusText = (status: VerifyOCOPStatus) => {
    switch (status) {
      case VerifyOCOPStatus.VERIFIED:
        return "Đã xác thực";
      case VerifyOCOPStatus.REJECTED:
        return "Từ chối";
      case VerifyOCOPStatus.PENDING:
        return "Chờ xác thực";
      case VerifyOCOPStatus.NOT_SUBMITTED:
        return "Chưa xác thực";
      default:
        return status;
    }
  };

  if (isLoading) {
    return <CustomBackdrop />;
  }

  if (!user?.storeId) {
    toast.error("Bạn chưa tạo cửa hàng");
    return null;
  }

  return (
    <Box sx={{ p: 1, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
        }}
      >
        <Typography variant="h4" fontWeight={600} sx={{ color: "text.primary" }}>
          Lịch sử xác thực OCOP
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm kiếm theo tên sản phẩm hoặc mã sản phẩm"
                value={searchTerm}
                onChange={handleSearchChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                select
                size="small"
                label="Trạng thái"
                value={selectedStatus}
                onChange={handleStatusChange}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value={VerifyOCOPStatus.ALL}>Tất cả</MenuItem>
                <MenuItem value={VerifyOCOPStatus.PENDING}>Chờ xác thực</MenuItem>
                <MenuItem value={VerifyOCOPStatus.VERIFIED}>Đã xác thực</MenuItem>
                <MenuItem value={VerifyOCOPStatus.REJECTED}>Từ chối</MenuItem>
                <MenuItem value={VerifyOCOPStatus.NOT_SUBMITTED}>Chưa xác thực</MenuItem>
              </TextField>
            </Stack>

            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header) => (
                      <TableCell
                        key={header.id}
                        align={header.align}
                        style={{ minWidth: header.minWidth }}
                      >
                        {header.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products?.data
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => (
                      <TableRow hover key={product.id}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {product.images?.[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                style={{
                                  width: 40,
                                  height: 40,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                }}
                              />
                            )}
                            <Typography>{product.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">{product.ocopStar || "-"}</TableCell>
                        <TableCell>{product.unit || "-"}</TableCell>
                        <TableCell>{product.address || "-"}</TableCell>
                        <TableCell>{product.issueDate || "-"}</TableCell>
                        <TableCell align="center">
                          <Typography
                            sx={{
                              color: getStatusColor(product.verifyOcopStatus),
                              fontWeight: 500,
                            }}
                          >
                            {getStatusText(product.verifyOcopStatus)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(product.createdAt).toLocaleString("vi-VN")}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenModal(product)}
                            sx={{
                              color: "success.main",
                              "&:hover": {
                                bgcolor: "success.lighter",
                              },
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={products?.data?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Modal xem chi tiết */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Chi tiết xác thực OCOP</DialogTitle>
        <DialogContent>
          {selectedHistory && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Số sao"
                  value={selectedHistory.star}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Trạng thái"
                  value={getStatusText(selectedHistory.status)}
                  disabled
                  fullWidth
                />
              </Stack>
              <TextField
                label="Tên sản phẩm"
                value={selectedHistory.productName}
                disabled
                fullWidth
              />
              <TextField
                label="Đơn vị"
                value={selectedHistory.unit}
                disabled
                fullWidth
              />
              <TextField
                label="Địa chỉ"
                value={selectedHistory.address}
                disabled
                fullWidth
              />
              <TextField
                label="Ngày cấp"
                value={selectedHistory.issueDate}
                disabled
                fullWidth
              />
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Hình ảnh minh chứng
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {selectedHistory.certificates.map((cert, index) => (
                    <Paper
                      key={index}
                      sx={{
                        width: 150,
                        height: 150,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <img
                        src={cert}
                        alt={`Certificate ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Paper>
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VerifyHistory;
